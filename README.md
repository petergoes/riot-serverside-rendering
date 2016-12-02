# Riot render on server

This is a proof of concept demonstrating that RiotJS can be rendered on the 
server.

## Installation

`$ npm install`

## Run

`$ npm start`

## How it works

In the tags folder, you'll find `sample.tag`. This is a standard RiotJS tag. 
When you request the page, the express app will put the rendered `sample.tag` in
the `src/index.html` file and sends it to the server. The `src/index.html` file 
mounts the same `sample.tag` file and picks up where the server rendered version
left off.

## No JS

Since this is a __very__ basic example, you could even run the app with 
javascript disabled in the browser. The `sample.tag` file submits the form which 
then performs a request to the server. The server parses the url parameter and 
renders the tag with the provided value
