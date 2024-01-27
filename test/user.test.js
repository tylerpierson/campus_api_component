// the packages and variables needed for setup
require('dotenv').config()
const request = require('supertest') // this is the thing that lets us run our code like postman
const { MongoMemoryServer } =  require('mongodb-memory-server')// this creates the fake mongodb databse that exists on our computer in our memory not on atlas
const app = require('../app') // this is our api application that we made with express this is the thing that we are giving to supertest to test
const User = require('../User/index').Model // this is for us to be able to do crud operation on the User
const mongoose = require('mongoose')
const server = app.listen(8080, () => console.log('Testing on Port 8080'))
let mongoServer 

// const mockAdmin = {
//   name: 'Test Admin',
//   email: 'admin@example.com',
//   password: 'password',
//   campus: 'Test Campus',
//   role: 'admin',
//   subjects: [],
//   students: [],
//   assignments: []
// }

// const mockTeacher = {
//   name: 'Test Teacher',
//   email: 'teacher@example.com',
//   password: 'password',
//   campus: 'Test Campus',
//   role: 'teacher',
//   subjects: [],
//   students: [],
//   assignments: []
// }

// const mockStudent = {
//   name: 'Test Student',
//   email: 'student@example.com',
//   password: 'password',
//   campus: 'Test Campus',
//   role: 'student',
//   subjects: [],
//   students: [],
//   assignments: []
// }

// let admin, teacher, student

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })

    // admin = new User(mockAdmin)
    // teacher = new User(mockTeacher)
    // student = new User(mockStudent)
})

afterAll(async () => {
    await mongoose.connection.close()// shut off mongoose connection with mongodb
    mongoServer.stop()
    server.close()
})



describe('Test suite for the /users routes on our api', () => {
    // Create User
    test('It should create a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Test Admin',
          email: 'admin@example.com',
          password: 'password',
          campus: 'Test Campus',
          role: 'admin',
          subjects: [],
          students: [],
          assignments: [] 
        })
        console.log(response.body)

      expect(response.body.user.name).toEqual('Test Admin')
      expect(response.body.user.email).toEqual('admin@example.com')
      expect(response.body.user.campus).toEqual('Test Campus')
      expect(response.body.user.role).toEqual('admin')
      expect(response.body).toHaveProperty('token')
    })
})