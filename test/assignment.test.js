// the packages and variables needed for setup
require('dotenv').config()
const request = require('supertest') // this is the thing that lets us run our code like postman
const { MongoMemoryServer } =  require('mongodb-memory-server')// this creates the fake mongodb databse that exists on our computer in our memory not on atlas
const app = require('../app') // this is our api application that we made with express this is the thing that we are giving to supertest to test
const mongoose = require('mongoose')
const server = app.listen(8081, () => console.log('Testing on Port 8081'))
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

describe('Test the assignments endpoints', () => {
    let assignmentId

    // Create assignment
    test('It should create a new assignment', async () => {
      const response = await request(app)
        .post('/assignments')
        .send({ title: 'Assignment #1', completed: false })
      
      expect(response.statusCode).toBe(200)
      expect(response.body.title).toEqual('Assignment #1')
      expect(response.body.completed).toBeFalsy()

      assignmentId = response.body._id
    })

    // Update assignment
    test('It should update an existing assignment', async () => {
        const response = await request(app)
            .put(`/assignments/${assignmentId}`)
            .send({ title: 'Measurements Assignment' })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('Measurements Assignment')
    })

    // Show assignment
    test('It should show a specific existing assignment based on the id', async () => {
        const response = await request(app)
            .get(`/assignments/${assignmentId}`)

        expect(response.statusCode).toBe(200)
    })

    // Destroy assignment
    test('It should delete an existing assignment', async () => {
        const response = await request(app)
            .delete(`/assignments/${assignmentId}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual(`The assignment with the ID of ${assignmentId} was deleted from the MongoDB database. No further action necessary.`)
    })

    // Index assignments
    test('Should index all assignments in the database', async () => {
        const response = await request(app)
            .get('/assignments')

        expect(response.statusCode).toBe(200)
    })
  })