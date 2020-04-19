const express = require('express');
const app = express();
const port = 1337;
var bodyParser = require('body-parser');
app.use(bodyParser.json({type:'application/json'}));

app.use(express.static('./client/public'))

app.get('/', function (req, res) { 
	res.sendFile('index.html', {root: './client/views'}) })

app.get('/mainMenu.html', function (req, res) { 
    res.sendFile('mainMenu.html', {root: './client/views'}) })

app.get('/game.html', function (req, res) { 
	res.sendFile('game.html', {root: './client/views'}) })

app.listen(port, () => console.log(`Snake App Listening On Port ${port}!`))