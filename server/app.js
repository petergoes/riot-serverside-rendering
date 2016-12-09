const promisify = require('bluebird').promisify;
const express = require('express');
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
