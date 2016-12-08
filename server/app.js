const express = require('express');
const riot = require('riot');
const appTag = require('../tags/app.tag');
const counterTag = require('../tags/counter.tag');
const nunjucks = require('nunjucks');
const app = express();

nunjucks.configure('src', {
  autoescape: false,
  express   : app
});

app.use(express.static('tags'));

app.get('/', function(req, res) {
	const data = { counter: req.query.counter || 0 };
	const myapp = riot.render(appTag, data);
	riot.compile(counterTag);
	riot.compile(appTag);
	res.render('index.html', {
		app: myapp,
		appData: JSON.stringify(data)
	})
});

app.listen(3000, function() {
	console.log('App listening on port 3000!');
});
