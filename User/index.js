const mongoose = require ('mongoose')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Setup User class
class User {
    constructor(Model, controller, router) {
        this.Model = Model
        this.controller = controller
        this.router = router
    }
}

// Setup userSchema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        title: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'admin'
    },
    campus: {
        name: String,
        required: true
    },
    grade: {
        type: Number,
        required: true,
    },
    subjects: [{
        type: String,
        required: true
    }],
    teachers: [{
        name: {type: String, required: true},
        grade: {type: Number, required: true},
        subjects: [{type: String}],
        students: [{type: String}]
    }],
    assignments: [{
        type: String,
        required: true,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    students: [{
        name: {type: String, required: true},
        grade: {type: Number, required: true},
        teachers: [{name: String, required: true}],
        subjects: [{type: String, required: true}]
    }]
});

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id}, 'secret')
    return token
}

// Setup Model variable
const Model = mongoose.model('User', userSchema)
// Setup controller variable
const controller = {
    async auth(req, res, next) {
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const data = jwt.verify(token, 'secret')
            const user = await User.findOne({ _id: data._id })
            if (!user) {
            throw new Error()
            }
            req.user = user
            next()
        } catch (error) {
            res.status(401).send('Not authorized')
        }
    },
      
    // Index
    async index(req, res) {
        try {
            const users = await User.find({})
            res.status(200).json(users)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
      
      // Create
    async create(req, res) {
        try{
            const user = new User(req.body)
            await user.save()
            const token = await user.generateAuthToken()
            res.json({ user, token })
        } catch(error){
            res.status(400).json({message: error.message})
        }
    },
      
    // Login
    async login(req, res) {
        try{
            const user = await User.findOne({ email: req.body.email })
            if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            res.status(400).send('Invalid login credentials')
            } else {
            const token = await user.generateAuthToken()
            res.json({ user, token })
            }
        } catch(error){
            res.status(400).json({message: error.message})
        }
    },
      
    // Update
    async update(req, res) {
        try{
            const updates = Object.keys(req.body)
            const user = await User.findOne({ _id: req.params.id })
            updates.forEach(update => user[update] = req.body[update])
            await user.save()
            res.json(user)
        }catch(error){
            res.status(400).json({message: error.message})
        }
    },
      
    // Destroy
    async destroy(req, res) {
        try {
            const deletedUser = await User.findOneAndDelete({ _id: req.params.id })
            res.status(200).json({ message: `The user with the ID of ${deletedUser._id} was deleted from the MongoDB database. No further action necessary.`})
        } catch (error) {
            res.status(400).json({ message: error.message }) 
        }
    },
      
    // Show
    async show(req, res) {
        try {
            const foundUser = await User.findOne({ _id: req.params.id });
            if (!foundUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(foundUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

// Setup User router -- ****NEED TO FIX THESE ROUTES****
router.get('/', controller.index) // Index router
router.post('/', controller.create) // Create router
router.post('/login', controller.login) // Login router
router.put('/:id', controller.update) // Update router
router.delete('/:id', controller.destroy) // Destroy router
router.get('/:id', controller.show) // Show router

// Export new User
module.exports = new User(Model, controller, router)