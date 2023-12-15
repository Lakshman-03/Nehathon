const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Replace the connection string with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/ganesh';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Connect to MongoDB using native driver
let db;
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  db = client.db();
  console.log('Connected to MongoDB');
});

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/ganesh');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const UserModel = mongoose.model('User', UserSchema);

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

// Login route
app.post('/alogin', (req, res) => {
  const { username, password } = req.body;

  // Use Mongoose to find user by username and password
  UserModel.findOne({ username, password })
  .then((user) => {
    if (user) {
      // Redirect to the dashboard upon successful login
      res.redirect('./dashboard');
    } else {
      res.send('Invalid login credentials');
    }
  })
  .catch((err) => {
    console.error('Error finding user:', err);
    res.send('Error finding user');
  });

});

// Dashboard route (replace with your actual dashboard HTML page)
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
