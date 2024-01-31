// the packages and variables needed for setup
require('dotenv').config()
const request = require('supertest') // this is the thing that lets us run our code like postman
const { MongoMemoryServer } =  require('mongodb-memory-server')// this creates the fake mongodb databse that exists on our computer in our memory not on atlas
const app = require('../app') // this is our api application that we made with express this is the thing that we are giving to supertest to test
const mongoose = require('mongoose')
const server = app.listen(8080, () => console.log('Testing on Port 8080'))
const campusCode = process.env.CAMPUS_CODE
const assignment = require('../Assignment/index')
let mongoServer 

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
  await mongoose.connection.close()
  mongoServer.stop()
  server.close()
})

afterAll((done) => done())

describe('Test the users endpoints', () => {
  // Set a variable for the token and user Id so I only have to call on the variables and not create a new User each time
  let authToken
  let userId

  // Create using campus code
  test('It should create a new user', async () => {
    const response = await request(app)
      .post(`/users`)
      .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123', campusNum: `${campusCode}`, role: 'admin' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toEqual('John Doe')
    expect(response.body.user.email).toEqual('john.doe@example.com')
    expect(response.body.user.password).toBeTruthy()
    expect(response.body).toHaveProperty('token')
  })

  // Login
  test('It should login a user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ email: 'john.doe@example.com', password: 'password123' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toEqual('John Doe')
    expect(response.body.user.email).toEqual('john.doe@example.com')
    expect(response.body).toHaveProperty('token')

    authToken = response.body.token
    userId = response.body.user._id
  })

  // Index
  test('It should index all users', async () => {
    expect(authToken).toBeDefined()

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
    
    expect(response.statusCode).toBe(200)
  })

  // Update
  test('It should update a user', async () => {
    expect(authToken).toBeDefined()
    expect(userId).toBeDefined()

    const response = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Jane Johnson', email: 'jane.johnson@example.com' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toEqual('Jane Johnson')
    expect(response.body.email).toEqual('jane.johnson@example.com')
  })

  // Create student as admin or teacher
  test('It should create a student as an admin or teacher role', async () => {
    expect(authToken).toBeDefined()
    expect(userId).toBeDefined()

    const response = await request(app)
      .post(`/users/addStudent/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'student' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('student');
    expect(response.body).toHaveProperty('token');
  })

  // Show
  test('It should create a new user', async () => {
    expect(authToken).toBeDefined()
    expect(userId).toBeDefined()

    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
    
    expect(response.statusCode).toBe(200)
  })

  // Add assignment
  test('It should add an assignment to a user\'s assignment array.', async () => {
    expect(authToken).toBeDefined()
    expect(userId).toBeDefined()

    const assignmentResponse = await request(app)
    .post('/assignments')
    .send({
      title: 'Sample Assignment',
      description: 'This is a sample assignment.',
    })

    let assignmentId = assignmentResponse.body._id

    const response = await request(app)
      .post(`/users/${userId}/assignments/${assignmentId}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('msg')
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('assignment')
  })
  
  // Destroy
  test('It should delete a user', async () => {
    expect(authToken).toBeDefined()
    expect(userId).toBeDefined()

    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
    
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual(`The user with the ID of ${userId} was deleted from the MongoDB database. No further action necessary.`)
  })
})