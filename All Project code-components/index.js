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
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING * ;';

    db.any(query, [
        req.body.username,
        hash
    ])
    .then(function (data) {
        console.log(data)
        res.redirect('/login')
      })
      // if query execution fails
      // send error message
      .catch(function (err) {
        res.redirect('/register')
      });
});

app.get('/login', (req, res) => {
    var logout = false;
    res.render('pages/login', {logout});
});

app.post('/login', async (req, res) => {
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

app.get('/discover', (req, res) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  axios({
    url: `https://app.ticketmaster.com/discovery/v2/events.json`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Accept-Encoding': 'application/json',
    },
    params: {
      apikey: process.env.API_KEY,
      keyword: 'Arctic Monkeys', //you can choose any artist/event here
      size: 10,
    },
  })
    .then(results => {
      const events = results.data._embedded.events;
      res.render("pages/discover", {events});
      events.forEach(event => console.log(event));
      //console.log(results.data); // the results will be displayed on the terminal if the docker containers are running // Send some parameters
    })
    .catch(error => {
      // Handle errors
      res.render("pages/discover", events = []);
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