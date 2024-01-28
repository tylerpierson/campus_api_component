const mongoose = require ('mongoose')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Assignment = require('../Assignment')
const secretKey = process.env.SECRET
const campusCode = process.env.CAMPUS_CODE

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
    password: { type: String, required: true},
    campus: {type: String, required: true},
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'admin'
    },
    subjects: [String],
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    teachers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    assignments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'}],
});

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id}, secretKey)
    return token
}

// Setup Model variable
const Model = mongoose.model('User', userSchema)
// Setup controller variable
const controller = {
    async auth(req, res, next) {
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const data = jwt.verify(token, secretKey)
            const user = await Model.findOne({ _id: data._id })

            if (!user) {
            throw new Error()
            }
            req.user = user
            next()
        } catch (error) {
            res.status(401).send('Not authorized')
        }
    },

    // adminRole middleware to prevent teachers and students from accessing certain datasets
    async adminRole(req, res, next) {
        if(req.user.role !== 'admin') {
            res.status(401).json('Permission Denied')
            return
        }
        next()
    },

    // middleware to allow all staff members certain permissions
    async staffPermissions(req, res, next) {
        if(req.user.role === 'student') {
            res.status(401).json('Permission Denied')
            return
        }
        next()
    },

    // teacherRole middleware to prevent students from accessing certain datasets
    async teacherRole(req, res, next) {
        if(req.user.role === 'teacher') {
            const students = await Model.find({ role: 'student' })
            res.status(200).json(students)
            return
        }
        next()
    },
      
    // Index
    async index(req, res) {
        try {
            const users = await Model.find({})
            res.status(200).json(users)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
      
    // Create
    async create(req, res) {
        try {
            const user = new Model(req.body)
            await user.save()
            const token = await user.generateAuthToken()

            res.json({ user, token })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
      
    // Login
    async login(req, res) {
        try{
            const user = await Model.findOne({ email: req.body.email })
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
        try {
            const updates = Object.keys(req.body)
            const user = await Model.findOne({ _id: req.params.id })

            updates.forEach(update => user[update] = req.body[update])
            await user.save()
            res.status(200).json(user)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
      
    // Destroy
    async destroy(req, res) {
        try {
            const user = await Model.findOne({ _id: req.params.id })

            // I'll use this block of code to authorize the user before deleting
            if (!req.user || req.user._id.toString() !== user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this user' })
            }

            const deletedUser = await Model.findOneAndDelete({ _id: req.params.id })
            res.status(200).json({ message: `The user with the ID of ${deletedUser._id} was deleted from the MongoDB database. No further action necessary.` })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
      
    // Show
    async show(req, res) {
        try {
            const foundUser = await Model.findOne({ _id: req.params.id })
            if (!foundUser) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.status(200).json(foundUser)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },

    // Create a new student as a teacher and push that student id into the teacher.students array
    async teacherCreateStudent(req, res) {
        try {
            const teacherId = req.params.id
            const teacher = await Model.findById(teacherId)
    
            if (!teacher || teacher.role !== 'teacher') {
                return res.status(404).json({ error: 'Teacher not found or invalid role' })
            }
            
            const student = new Model(req.body)
            student.role = 'student'
            student.teachers.push(teacher._id)
            await student.save()
    
            teacher.students.push(student._id)
            await teacher.save()
    
            const token = await student.generateAuthToken()
    
            res.json({ student, token })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },

    // POST /users/:userId/assignments/:assignmentId
    async addAssignment(req, res) {
        try {
            const foundAssignment = await Assignment.Model.findOne({ _id: req.params.assignmentId })
            if (!foundAssignment) throw new Error(`Could not locate assignment ${req.params.assignmentId}`)
    
            const foundUser = await Model.findOne({ _id: req.params.userId })
            if (!foundUser) throw new Error(`Could not locate user ${req.params.userId}`)
    
            // many-to-many relationship
            foundUser.assignments.push(foundAssignment._id)
            foundAssignment.class.push(foundUser._id)
            await foundUser.save()
            await foundAssignment.save()
    
            res.status(200).json({
                msg: `Successfully associated assignment with id ${req.params.assignmentId} with user with id ${req.params.userId}`,
                user: foundUser,
                assignment: foundAssignment
            });
        } catch (error) {
            res.status(400).json({ msg: error.message })
        }
    }
}

// Setup User router
router.get('/', controller.auth, controller.adminRole, controller.index) // Index router
// router.post('/', controller.create) // Create router
router.post(`/${campusCode}`, controller.create) // Create with campus Code
router.post('/login', controller.login) // Login router
router.put('/:id', controller.auth, controller.staffPermissions, controller.update) // Update router
router.delete('/:id', controller.auth, controller.adminRole, controller.destroy) // Destroy router
router.get('/:id', controller.show) // Show router
router.post('/:id', controller.teacherCreateStudent) // Create a student as a teacher *** NEEDS TESTING STILL ***
router.post('/:userId/assignments/:assignmentId', controller.auth, controller.staffPermissions, controller.addAssignment)


// Export new User
module.exports = new User(Model, controller, router)