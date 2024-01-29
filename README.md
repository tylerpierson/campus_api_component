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