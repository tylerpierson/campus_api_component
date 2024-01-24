const express = require('express')
const app = express()
const User = require('./User')
const Assignment = require('./Assignment')

app.use(express.json())
app.use('/users', Movie.router)
app.use('/assignments', Assignment.router)


module.exports = app