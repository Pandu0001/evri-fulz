const express = require('express');
const path = require('path');
const antibot = require('./middleware/antibot');
const app = new express();
const port = process.env.PORT || 3000;

app.set("trust proxy", true);

// ANTI-BOT 
app.use(antibot);

// Middlewares
app.use(express.static(path.join(`${__dirname}/public`)));
app.use(express.urlencoded({ extended: true }));

// SET VIEW EJS ENGINE
app.set("view engine", "ejs");

// Routes
const router = require('./routers/router');
app.use('/', router);

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
