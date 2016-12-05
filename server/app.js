const express = require('express');
const riot = require('riot');
const nunjucks = require('nunjucks');
const counter = require('../tags/counter.tag');
const app = express();

nunjucks.configure('src', {
  autoescape: false,
  express   : app
});

app.use(express.static('tags'));

app.get('/', function(req, res) {
	const data = { counter: req.query.counter || 0 };
	const mycounter = riot.render(counter, data);
	res.render('index.html', {
		counter: mycounter,
		counterData: JSON.stringify(data)
	})
});

app.listen(3000, function() {
	console.log('App listening on port 3000!');
});
