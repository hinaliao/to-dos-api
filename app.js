const express = require('express');
const app = express();

const todoRoutes = require('./routes/todo-Routes');
require('./database/db.config');

// Middleware
app.use(express.json());

// Middleware (routes config)
app.use('/', todoRoutes);

app.listen(5000, () => console.log('App rodando na porta 5000'));