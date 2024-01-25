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
    completed: { type: Boolean, default: false },
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
            const assignments = await Model.find({})
            res.status(200).json(assignments)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },

    // create
    async create(req, res) {
        try {
            const assignment = new Model(req.body)
            res.status(200).json(assignment)
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    },

    // update
    async update(req, res) {
        try{
            const updates = Object.keys(req.body)
            const assignment = await Model.findOne({ _id: req.params.id })
            updates.forEach(update => assignment[update] = req.body[update])
            await assignment.save()
            res.json(assignment)
        }catch(error){
            res.status(400).json({message: error.message})
        }
    },

    // destroy
    async destroy(req, res) {
        try {
            const deletedAssignment = await Model.findOneAndDelete({ _id: req.params.id })
            res.status(200).json({ message: `The assignment with the ID of ${deletedAssignment._id} was deleted from the MongoDB database. No further action necessary.`})
        } catch (error) {
            res.status(400).json({ message: error.message }) 
        }
    },

    // show
    async show(req, res) {
        try {
            const foundAssignment = await Model.findOne({ _id: req.params.id });
            if (!foundAssignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }
            res.status(200).json(foundAssignment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

// Setup User router
router.get('/', controller.index) // Index router
router.post('/', controller.create) // Create router
router.put('/:id', controller.update) // Update router
router.delete('/:id', controller.destroy) // Destroy router
router.get('/:id', controller.show) // Show router

module.exports = new Assignment(Model, controller, router)