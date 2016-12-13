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
let todos;

nunjucks.configure('src', {
  autoescape: false,
  express   : app
});

app.use(express.static('tags'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer().array());

app.post('/', addNewTodo, updateTodos, deleteTodos, renderResponse);
app.get('/', renderResponse);

compiledTags
	.then(() => app.listen(3000))
	.then(() => console.log('Listening on port 3000!'));

MongoClient.connect('mongodb://localhost:27017')
	.then((db) => database = db)
	.then(() => todos = database.collection('todos'))
	.then(() => console.log('Connected to database'))
	.catch((err) => console.log('err:', err));

function addNewTodo(req, res, next) {
	if (req.body['new-todo']) {
		const todoObj = {
			name: req.body['new-todo'],
			createdAt: Date.now(),
			updatedAt: Date.now(),
			completed: false
		};

		todos.insert(todoObj)
			.then(next())
			.catch((err) => res.status(500).send(err))
	} else {
		next();
	}
}

function updateTodos(req, res, next) {
	if (req.body.completed) {
		let completed = ((typeof req.body.completed === 'string') ? [req.body.completed] : req.body.completed);
		todos.find({}, {_id: 1}).toArray()
			.then((result) => {
				const allIds = result.map(obj => obj._id.toString());
				const updates = allIds.map(id => {
					return todos.update({ _id: new ObjectId(id)}, { $set: { completed: completed.includes(id) } })
				})
				Promise.all(updates)
					.then(next());
			});
	} else {
		next();
	}
}

function deleteTodos(req, res, next) {
	if (req.body.delete) {
		const toDelete = (typeof req.body.delete === 'string') ? [req.body.delete] : req.body.delete;
		Promise.all(toDelete.map(id => todos.remove( {_id: new ObjectId(id) } )))
			.then(next());
	} else {
		next();
	}
}

function renderResponse(req, res) {
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
}
