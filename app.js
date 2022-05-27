const express = require('express');
const app = express();

const cors = require('cors');
const { param } = require('express/lib/request');

const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoClient = mongodb.MongoClient;
const URL = 'mongodb+srv://Naveen:naveen21@cluster0.c3oly.mongodb.net/task?retryWrites=true&w=majority';

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

// added
// let students = [];

function authenticate(req, res, next) {
  // Check token present in header
  if (req.headers.authorization) {
    let decode = jwt.verify(req.headers.authorization, 'thisisasecretkey');
    if (decode) {
      req.userId = decode.id;
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
  // if present
  // check toen is valid
  // if valid
  // next()

  // res.status(401).json({message : "Unauthorized"})
  // next()
}

// Method : GET
// route : /students
// params :
// Body :

// Return
// [{name : ""},{name : ""}

app.post('/register', async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = (await connection).db('task');

    let salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    await db.collection('users').insertOne(req.body);
    await connection.close();
    res.json({ message: 'User Created' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/login', async (req, res) => {
  try {
    // open the connection
    let connection = await mongoClient.connect(URL);
    // select the db
    let db = connection.db('task');
    // fetch user with email id from DB
    let user = await db.collection('users').findOne({ email: req.body.email });
    if (user) {
      // if user given password is == user password in db
      let compare = bcrypt.compareSync(req.body.password, user.password);
      if (compare) {
        // Generate JWT token
        let token = jwt.sign(
          { name: user.name, id: user._id },
          'thisisasecretkey',
          { expiresIn: '1h' }
        );
        res.json({ token });
      } else {
        res.status(500).json({ message: 'Credientials does not match' });
      }
    } else {
      res.status(401).json({ message: 'Credientials does not match' });
    }
    // if no?
    // throw err user not found
    // if yes?
    await connection.close();
    // close the connection
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Web server Started');
});

// What is nodejs
// Why Nodejs
// packages
// OS
// fs
// express
// routes
// route params
// Full CRUD api
// Connecting Mongodb with Nodejs

// User Registration
// User Login
// Recap

// Wireframe
// Design
// API
// HTML & CSS Convertion
// API intergration
