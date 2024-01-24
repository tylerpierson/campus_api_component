const mongoose = require ('mongoose')
const express = require('express')
const router = express.Router()

// Setup User class
class Assignment {
    constructor(Model, controller, router) {
        this.Model = Model
        this.controller = controller
        this.router = router
    }
}

// Setup userSchema


// Setup Model variable
// Setup controller variable


// Setup User router


module.exports = new User(Model, controller, router)