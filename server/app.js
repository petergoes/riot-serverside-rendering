const express = require('express');
const riot = require('riot');
const nunjucks = require('nunjucks');
const sample = require('../tags/sample.tag');
const app = express();

nunjucks.configure('src', {
  autoescape: false,
  express   : app
});

app.use(express.static('tags'));

app.get('/', function(req, res) {
	const data = { counter: req.query.counter || 0 };
	const mysample = riot.render(sample, data);
	res.render('index.html', {
		sample: mysample,
		sampleData: JSON.stringify(data)
	})
});

app.listen(3000, function() {
	console.log('App listening on port 3000!');
});
