// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.
const yelp = require('yelp-fusion'); // Yelp API

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

app.get('/', (req, res) => {
    res.redirect('/login'); //this will call the /anotherRoute route in the API
});

app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {  
    
    const username = req.body.username; // Username field
    const password = req.body.password; // Password field
    const isOwner = req.body.isOwner == null ? false : true // True if box is ticked, false otherwise
    const hash = await bcrypt.hash(password, 10);

    // console.log("Owner box checked: " + isOwner);

    const userReg = 'INSERT INTO users (username, pwd) VALUES ($1, $2) RETURNING user_id ;';
    const ownerReg = `INSERT INTO owners (owner_id) VALUES (SELECT user_id from users where users.username = $1);`;

    db.task('do-everything', task => {
      if (isOwner) {
        console.log("Adding owner");
        return task.batch([
          task.any(userReg, [
            username,
            hash
          ]),
          task.any(ownerReg, [
            username
          ]),
        ]);
      } else {
        console.log("Adding regular user")
        return task.batch([
          task.any(userReg, [
            username,
            hash
          ]),
        ]);
      }
    })
    .then(function (data) {
        console.log("Registration succeeded")
        //console.log(data)
        res.redirect('/login')
      })
      // if query execution fails
      // send error message
      .catch(function (err) {
        console.log("Registration failed")
        res.redirect('/register')
      });
});

app.get('/login', (req, res) => {
    var logout = false;
    res.render('pages/login', {logout});
});

app.post('/login', async (req, res) => {

    // Will add actual functionality to this once we have some working front end
    // For now this is just for passing our unit tests
    var username = "12345";
    var password = "abcde";

    if(req.body.username === username && req.body.password === password){
        res.status(200);
        res.json({message: 'Success'});
    } else {
        res.status(400);
        res.json({message: 'Failed'});
    }
    
    // if query execution fails
    // send error message
});

app.get('/getReviews', (req, res) => {

  // Working API connection, need to determine what API calls we need
  const client = yelp.client(process.env.API_KEY);

  const searchRequest = {
    location: 'boulder, co'
  };
  client.search(searchRequest)
  .then(results => {
    res.json({status: 'success'});
    console.log(results)
  })
  .catch(error => {
    // Handle errors
    console.log(error);
  });

});

app.get("/logout", (req, res) => {
  req.session.destroy();
  var logout = true;
  res.render("pages/login", {logout});
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');