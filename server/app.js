const promisify = require('bluebird').promisify;
const express = require('express');
const bodyParser = require('body-parser')
const riot = require('riot');
const nunjucks = require('nunjucks');
const { compiledTags } = require('./compiler');
const MongoClient = promisify(require('mongodb').MongoClient);
const app = express();

let database;

nunjucks.configure('src', {
  autoescape: false,
  express   : app
});

app.use(express.static('tags'));

app.post('/', bodyParser.urlencoded({ extended: false }), function(req, res) {
	const todos = database.collection('todos');
	const addNewTodo = new Promise((resolve, reject) => {
		if (req.body['new-todo']) {
			const todoObj = {
				name: req.body['new-todo'],
				createdAt: Date.now(),
				updatedAt: Date.now(),
				completed: false
			};
			todos.insert(todoObj)
				.then((result) => resolve(result))
				.catch((err) => reject(err))
		} else {
			resolve()
		}
	});

	addNewTodo.then(() => {
		todos.find({}).toArray()
			.then((result) => {
				const data = {
					todos: result
				};
				const html = riot.render('todo-overview', data);
				res.render('index.html', {
					html: html
				})
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
				html: html
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
