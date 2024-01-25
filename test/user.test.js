// the packages and variables needed for setup
const request = require('supertest') // this is the thing that lets us run our code like postman
const { MongoMemoryServer } =  require('mongodb-memory-server')// this creates the fake mongodb databse that exists on our computer in our memory not on atlas
const app = require('../app') // this is our api application that we made with express this is the thing that we are giving to supertest to test
const User = require('../User/index') // this is for us to be able to do crud operation on the User
const mongoose = require('mongoose')
const server = app.listen(8080, () => console.log('Testing on Port 8080'))
let mongoServer 

const mockAdmin = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'password',
  campus: 'Test Campus',
  role: 'admin',
  subjects: [],
  students: [],
  assignments: []
}

const mockTeacher = {
  name: 'Test Teacher',
  email: 'teacher@example.com',
  password: 'password',
  campus: 'Test Campus',
  role: 'teacher',
  subjects: [],
  students: [],
  assignments: []
}

const mockStudent = {
  name: 'Test Student',
  email: 'student@example.com',
  password: 'password',
  campus: 'Test Campus',
  role: 'student',
  subjects: [],
  students: [],
  assignments: []
}

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    await mongoose.connection.close()// shut off mongoose connection with mongodb
    mongoServer.stop()
    server.close()
})



describe('Test suite for the /users routes on our api', () => {
    // /users
    test('It should create a new user in the db', async () => {
      const response = await request(app).post('/users').send({
        name: 'Tyler Pierson',
        email: 'tyler@pierson.com',
        password: 'secret',
        campus: 'Sandbrock Elementary',
        role: 'admin',
        subjects: [],
        students: [],
        assignments: []
      });
  
      // expect(response.statusCode).toBe(200);
      expect(response.body.user.name).toEqual('Tyler Pierson');
      expect(response.body.user.email).toEqual('tyler@pierson.com');
      // Adjust other expectations as needed based on your application's response structure
    });

    // /users/login
    test('It should login a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
    
        const response = await request(app)
          .post('/users/login')
          .send({ email: 'john.doe@example.com', password: 'password123' })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('John Doe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body).toHaveProperty('token')
      })
    // /users/:id update
      test('It should update a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
        const token = await user.generateAuthToken()
    
        const response = await request(app)
          .put(`/users/${user._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Jane Doe', email: 'jane.doe@example.com' })
        
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toEqual('Jane Doe')
        expect(response.body.email).toEqual('jane.doe@example.com')
      })
      // /user/:id delete
      test('It should delete a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
        const token = await user.generateAuthToken()
    
        const response = await request(app)
          .delete(`/users/${user._id}`)
          .set('Authorization', `Bearer ${token}`)
        
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User deleted')
      })
    
})