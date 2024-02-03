# Campus Population Database Application
This is a **Campus Population Database Application**, a streamlined example 
showcasing a RESTful API seamlessly integrated with a backend **MongoDB** database.

![Model Example Image](https://i.imgur.com/jLc3SEU.png)

The application is designed in a component driven format and is split into two main components, 
**Users** and **Assignments**. The index.js files within these two directories house the models, 
controllers, and routes for the entire application.

Each component is paired with its own test file to seamlessly test the functionality
of the application.

## What's included
Within the download, the following directories and files will be found:
```
campus-api-component
    |-- Assignment
    |   |-- index.js
    |-- test
    |   |-- assignment.test.js
    |   |-- user.test.js
    |-- User
    |   |-- index.js
    |-- views
    |   |-- Layouts
    |   |   |-- Layout.jsx
    |   |   |-- Nav.jsx
    |   |-- users
    |   |   |-- Login.jsx
    |-- .gitignore
    |-- app.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- server.js
```
## Included Models
### User Model ('admin', 'teacher', 'student')
```
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
})
```
### Assignment Model
```
const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    class: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
},{
    timestamps: true
})
```

## Getting Started
1. Navigate to where the directory will be stored within your computer.
2. Clone the repository into your computer by using git clone followed by the SSH link found on my [GitHub](https://github.com/tylerpierson/campus_api_component/tree/main)
3. Once the directory is cloned onto your computer, run ```npm i``` in the command line to install
    all of the dependencies found within my package.json file.
4. Within the root folder, touch .env and add in your personal MongoDB connection String in the following
    format: **mongodb+srv://piertyler:<\password>@cluster0.ozwjnx2.mongodb.net/?retryWrites=true&w=majority**
5. While still in the .env file, include a secret [SHA256](emn178.github.io/online-tools/sha256.html) key in the following
    format: **SECRET=<\secretKey>**. Also include a campus code to create initial admin accounts in the following format:
    **CAMPUS_CODE:<\code of your choosing>**.
    **Save updated code**
6. Begin running tests

### Running API Testing
To run the automated tests, run ```npm run test``` in the command line. This should return that **2 Test Suites** passed
and **12 Tests** have passed with **0 fails**, indicating a successful installation of the application.

## Running Manual Tests in PostMan
### Create initial user using a CAMPUS CODE
In order to create an initial user on the application, a campus code is needed. With the proper code connected through the .env file, you would send a POST request to **localhost:3000/users/${campusCode}**. The necessary information can be located within the **User/index.js** file, but can be seen below with example values (any information not included from the userSchema is optional). This information will be placed as JSON in the body of the postman request:
```
    {
        "name": "John Doe",
        "email": "johndoe@admin.com",
        "password": "secret",
        "campusNum": `${campusCode}`
        "role": "admin"
    }
```
After this sends, it should return a new user with an ID. This ID will be used later to create more users from that specific account.

### Login User
To log into the user account, another POST request will be sent to **localhost:3000/users/login**. The only information that will be needed is a valid **email** and **password** from an existing user. Once that user has been logged in, an authentication token will be generated to grant that user specific permissions. For the recently created admin, it is important to grab that token and store it in the header with a key of *Authorization* and a value of *Bearer <\your auth token>*. This will be utilized later when creating more teachers and students.

![Login Model Example Image](https://i.imgur.com/ixF5UZh.png)

### Index Users
To index the users, send a GET request to **localhost:3000/users** as an administrator with an admin auth token in the header. No body is required to send this request.
This request should return a list of all created users in the database.

### Update Users
To update a user, the user's role must be 'admin' or 'teacher' according to the permissions granted by the **staffPermissions** middleware that is in place. The user will submit a PUT request to **localhost:3000/:id** and within the body, will input JSON text in the following format:
```
    {
        "name": "Jane Doe"
    }
```
Once submitted, this change will be made and the user will be displayed with the new changes.

### Destroy Users
The destroy controller is only authorized by an administrator and is inaccessible by any other role. Submit a DELETE request to **localhost:3000/users/:id** to destroy whichever user was selected. A message should display indicating that the user has been successfully destroyed.

### Show User
To show an individual user, submit a GET request to **localhost:3000/users/:id**. *No authorization necessary*.

### Show Class
In order to show a specific class with the teacher and the students within that teacher's students array, send a get request as a teacher to **localhost:3000/users/class/:id**.

### Create a new **STUDENT** as a staff member (Admin or Teacher)
If you are currently logged into an admin account or a teacher account, you can create new student account by submitting a POST request to **localhost:3000/users/:id**. When creating the student be sure to enter the role as 'student' or it will not process correctly. The campusNum will be auto populated based on the creators campusNum.
```
    {
        "name": "Steve Rogers",
        "email": "steve@student.com",
        "password": "secret",
        "role": "student"
    }
```
Once the student has been created, the newly created student ID will be populated into the creating user's 'students' array, and if the creator is a 'teacher' role, then the teacher's ID will be populated in the newly created student's 'teachers' array.

### Create a new **TEACHER** as an admin role
If you are logged into an admin account, you can create a new teacher by following the same steps as above when creating a student. The only difference, is that the teacher's role must be set as 'teacher' prior to submission.

### Create an assignment
To create an assignment, a POST request must be sent with the following JSON format in the body of the request:
```
    {
        "title": "Assignment 1",
        "description: "This is the first assignment",
        "completed": false
    }
```
Once the assignment has been created, it will generate an ID for that specific assignment.

### Add assignment to a user in the database
In order to add an assignment to the 'assignments' array within the user model, a POST request must be sent to **localhost:3000/users/:userId/assignments/:assignmentId**.

### Update an assignment
To update an assignment, send a PUT request to **localhost:3000/assignments/:id** with the updated information in the body.

```
    {
        "title": "Measurements and Angles assignment"
    }
```

### Index assignments
To index all assignments that have been created, send a GET request to **localhost:3000/assignments**. This will return a list of all previously made assignments.

### Show an assignment
In order to show an existing assignment, send a GET request to **localhost:3000/assignments/:id**. This will return one specific assignment.

### Destroy an assignment
To destroy or delete an existing assignment, send a DELETE request to **localhost:3000/assignments/:id**. When the assignment is deleted successfully, you should receive back a message of `The assignment with the ID of ${deletedAssignment._id} was deleted from the MongoDB database. No further action necessary.`