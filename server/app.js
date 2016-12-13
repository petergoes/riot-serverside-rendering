const promisify = require('bluebird').promisify;
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const riot = require('riot');
const nunjucks = require('nunjucks');
const { compiledTags } = require('./compiler');
const MongoClient = promisify(require('mongodb').MongoClient);
const multer = require('multer');
const app = express();

let database;

nunjucks.configure('src', {
  autoescape: false,
  express   : app
});

app.use(express.static('tags'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer().array());

app.post('/test', function(req, res) {
	res.send(req.body);
});

app.post('/', function(req, res) {
	const todos = database.collection('todos');
	const addNewTodo = new Promise((resolve, reject) => {
		if (req.body['new-todo']) {
			const todoObj = {
				name: req.body['new-todo'],
				createdAt: Date.now(),
				updatedAt: Date.now(),
				completed: false
			};
			return todos.insert(todoObj)
				.then(resolve)
				.catch((err) => reject(err))
		} else {
			let completed;
			if (req.body.completed) {
				completed = ((typeof req.body.completed === 'string') ? [req.body.completed] : req.body.completed);
			} else {
				completed = [];
			}

			return todos.find({}, {_id: 1}).toArray().then((result) => {
				const allIds = result.map(obj => obj._id.toString());

				const updates = allIds.map(id => {
					return todos.update({ _id: new ObjectId(id)}, { $set: { completed: completed.includes(id) } })
				})
				return Promise.all(updates)
					.then(resolve);
			});
		}
	});

	addNewTodo
		.then((result) => {
			if (req.body.delete) {
				const toDelete = (typeof req.body.delete === 'string') ? [req.body.delete] : req.body.delete;
				return Promise.all(toDelete.map(id => todos.remove( {_id: new ObjectId(id) } )));
			} else {
				return result
			}
		})
		.then(() => {
			todos.find({}).toArray()
				.then((result) => {
					if (req.headers.accept === 'application/json') {
						res.json(result);
					} else {
						const data = {
							todos: result
						};
						const html = riot.render('todo-overview', data);
						res.render('index.html', {
							html,
							data: JSON.stringify(data)
						})
					}
				});	
		});
});

app.get('/', function(req, res) {
	const todos = database.collection('todos');
	todos.find({}).toArray()
		.then((result) => {
			const data = {
				todos: result
			};
			const html = riot.render('todo-overview', data);
			res.render('index.html', {
				html,
				data: JSON.stringify(data)
			})
		});
});

compiledTags
	.then(() => app.listen(3000))
	.then(() => console.log('Listening on port 3000!'));

MongoClient.connect('mongodb://localhost:27017')
	.then((db) => database = db)
	.then(() => console.log('Connected to database'))
	.catch((err) => console.log('err:', err));
