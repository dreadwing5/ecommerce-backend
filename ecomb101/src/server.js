
  import express from 'express';
  import mysql from 'mysql2';
  import bodyParser from 'body-parser';
  import { json } from 'express';
  
  const app = express();
  const port = 5000;
  
  // Create a MySQL connection
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1990',
    database: 'db',
  });
  // Connect to the database
  db.connect((err) => {
    if (err) {
      console.error('Database connection error: ' + err.stack);
      return;
    }
    console.log('Connected to the database');
  });
  
  // Middleware to parse JSON data from requests
  app.use(
    json({
      limit: "10kb",
    })
  );
  
  // Route for registering a new user
  app.post('/test', (req, res) => {
    console.log(req.body);
  });



  app.post('/register', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertUserQuery, [username, password], (err, results) => {
      if (err) {
        console.error('Error registering user: ' + err.message);
        res.status(500).json({ error: 'User registration failed' });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
  });

  
  
  // Route for logging in an existing user
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const findUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(findUserQuery, [username], (err, results) => {
      if (err) {
        console.error('Error finding user: ' + err.message);
        res.status(500).json({ error: 'Login failed' });
      } else if (results.length === 0) {
        res.status(401).json({ error: 'User not found' });
      } else {
        const user = results[0];
        if (user.password === password) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Incorrect password' });
        }
      }
    });
  });
  
  // Route for the root URL (you can customize this route)
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
  
  app.listen(port, () => console.log(`Server is running on port ${port}`));
  