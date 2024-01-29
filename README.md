# Campus Population Database Application
This is a **Campus Population Database Application**, a streamlined example 
showcasing a RESTful API seamlessly integrated with a backend **MongoDB** database.

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
    |-- .gitignore
    |-- app.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- server.js
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
### Create initial user
In order to create an initial user on the application, a campus code is needed. With the proper code connected through the .env file, you would send a POST request to **localhost:3000/users/${campusCode}**. The necessary information can be located within the **User/index.js** file, but can be seen below with example values (any information not included from the userSchema is optional). This information will be placed as JSON in the body of the postman request:
```
    {
        "name": "John Doe",
        "email": "johndoe@admin.com",
        "password": "secret",
        "campus": "GA Elementary"
        "role": "admin"
    }
```
After this sends, it should return a new user with an ID. This ID will be used later to create more users from that specific account.

### Login User
To log into the user account, another POST request will be sent to **localhost:3000/users/login**. The only information that will be needed is a valid **email** and **password** from an existing user. Once that user has been logged in, an authentication token will be generated to grant that user specific permissions. For the recently created admin, it is important to grab that token and store it in the header with a key of *Authorization* and a value of *Bearer <\your auth token>*. This will be utilized later when creating more teachers and students.