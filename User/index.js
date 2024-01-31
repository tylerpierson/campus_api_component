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
    campusNum: String,
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

    async campusProtection(req, res, next) {
        const user = new Model(req.body)

        if(user.campusNum !== campusCode) {
            res.status(401).json('Incorrect campus code. Please see your administrator for more information.')
            return
        }
        next()
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
            const users = await Model.find({ campusNum: `${campusCode}`})
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

    // Show Class
    async showClass(req, res) {
        try {
            const userId = req.params.id
            
            const user = await Model.findById(userId)
                .populate('teachers', 'name email campusNum role subjects')
                .populate('students', 'name email campusNum role subjects')

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            res.status(200).json(user)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },

    // Create a new teacher as an administrator and push that teacher id into the admin.teachers array
    async createTeacher(req, res) {
        try {
            const adminId = req.params.id
            const admin = await Model.findById(adminId)
    
            if (!admin || admin.role !== 'admin') {
                return res.status(404).json({ error: 'Admin member not found or invalid role' })
            }
            
            const teacher = new Model(req.body)
            teacher.role = 'teacher'

            teacher.campusNum = admin.campusNum

            admin.teachers.push(teacher._id)
            await admin.save()
            await teacher.save()

            const token = await teacher.generateAuthToken()
    
            res.json({ teacher, token })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },

    // Create a new student as a staff member and push that student id into the staff.students array
    async createStudent(req, res) {
        try {
            const staffId = req.params.id
            const staff = await Model.findById(staffId)
    
            if (!staff || staff.role === 'student') {
                return res.status(404).json({ error: 'Staff member not found or invalid role' })
            }
            
            const student = new Model(req.body)
            student.role = 'student'

            student.campusNum = staff.campusNum

            if(staff.role === 'teacher') {
                student.teachers.push(staff._id)
                await student.save()
            }
    
            staff.students.push(student._id)
            await staff.save()
    
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
router.post('/', controller.campusProtection, controller.create) // Create with campus Code
router.post('/login', controller.login) // Login router
router.put('/:id', controller.auth, controller.staffPermissions, controller.update) // Update router
router.delete('/:id', controller.auth, controller.adminRole, controller.destroy) // Destroy router
router.get('/:id', controller.show) // Show router
router.get('/class/:id', controller.showClass) // Show router that only shows one class
router.post('/:id', controller.auth, controller.createTeacher) // Create a teacher as admin
router.post('/addStudent/:id', controller.auth, controller.createStudent) // Create a student as a staff member
router.post('/:userId/assignments/:assignmentId', controller.auth, controller.staffPermissions, controller.addAssignment)


// Export new User
module.exports = new User(Model, controller, router)