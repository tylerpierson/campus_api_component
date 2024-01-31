const express = require('express')
const app = express()
const User = require('./User')
const Assignment = require('./Assignment')
const jsxEngine = require('jsx-view-engine')

app.use(express.json())
app.use('/users', User.router)
app.use('/assignments', Assignment.router)

// Set up the view engine
app.set('view engine', 'jsx')
app.engine('jsx', jsxEngine())

module.exports = app