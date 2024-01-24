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
const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    class: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
},{
    timestamps: true
}
)

// Setup Model variable
const Model = mongoose.model('Assignment', assignmentSchema)
// Setup controller variable
const controller = {
    // index
    async index(req, res) {
        try {
            const foundAssignments = await Model.find({})
            res.status(200).json(foundAssignments)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    },

    // create
    async create(req, res) {
        try {
            const createdAssignment = Model.create(req.body)
            res.status(200).json(createdAssignment)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    },

    // update
    async update(req, res) {
        try {
            const updatedAssignment = Model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            res.status(200).json(updatedAssignment)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    },

    // destroy
    async destroy(req, res) {
        try {
            const destroyedAssignment = Model.findOneAndDelete({ _id: req.params.id })
            res.status(200).json({ msg: `Assignment ${destroyedAssignment._id} was deleted from the MongoDB database. No further action necessary.`})
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    },

    // show
    async show(req, res) {
        try {
            const foundAssignment = Model.findOne({ _id: req.params.id })
            res.status(200).json(foundAssignment)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }
}

// Setup User router
router.get('/assignments/', controller.index) // Index router
router.post('/assignments/', controller.create) // Create router
router.put('/assignments/:id', controller.update) // Update router
router.delete('/assignments/:id', controller.destroy) // Destroy router
router.get('/assignments/:id', controller.show) // Show router

module.exports = new User(Model, controller, router)