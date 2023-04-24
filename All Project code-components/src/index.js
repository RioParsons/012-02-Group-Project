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

    const userReg = 'INSERT INTO users (username, pswd) VALUES ($1, $2) RETURNING user_id ;';
    const ownerReg = `INSERT INTO owners (owner_id) (SELECT user_id FROM users WHERE users.username = $1);`;

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
    /*
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
    // send error message */

    // console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT * FROM users WHERE username = '${req.body.username}';`
    // check if password from request matches with password in D
    db.any(query)
    .then(async function (user) {
        // console.log(user);

        if(user != null){
            const match = await bcrypt.compare(password, user[0].pswd);
            if (match) {
                //save user details in session like in lab 8
                console.log("User found");
                req.session.user = user;
                req.session.save();
    
                res.redirect('/discover');
            } else {
                console.log("Username or password is incorrect");
                res.render('pages/login');
            }
        } else {
            console.log("User not found");
            res.redirect('/register');
        }
    })
    // if query execution fails
    // send error message
    .catch(function (err) {
        console.log("Database request failed", err);
        res.redirect('/register');
    });
});

app.get('/discover', (req, res) => {

  // Need to clarify how these queries will be written in next team meeting.
  // const topRestaurantsQuery = ;
  const highestRatedQuery = `SELECT r.name, r.image_url, AVG(rt.rating_number) AS average_rating FROM restaurants r JOIN ratings rt ON r.restaurant_id = rt.restaurant_id GROUP BY r.restaurant_id ORDER BY average_rating DESC LIMIT 4;`;
  // const weeksEventsQuery;
  // const dailyDealsQuery;
  
  db.task('do-everything', task => {
    return task.batch([
      task.any(highestRatedQuery, []),
      //task.any(topRestaurantsQuery, []),
      //task.any(weeksEventsQuery, []),
      //task.any(dailyDealsQuery, []),
    ]) 
  })
    .then(function (data) {
      console.log(data)
      //console.log(data)
      res.render('pages/discover', {data})
    })
    // if query execution fails
    // send error message
    .catch(function (err) {
      console.log("failed")
      res.render('pages/discover', {data})
    });

});

app.get('/deals', (req, res) => {
  res.render('pages/deals');
});

app.get('/calendar', (req, res) => {
  res.render('pages/calendar');
});

app.get('/events', (req, res) => {
  res.render('pages/events');
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

app.get("/restaurant/:rid", async  (req, res) => {

  if(!exists(req.params.rid)) {
    //todo render an error page
    console.log("PLEASE FIX ERROR NEAR LINE 174")
    return;
  }

  console.log(`rid: ${req.params.rid}`)
  var r_dat_db_query = `SELECT * FROM restaurants WHERE restaurant_id=${req.params.rid}`

  let [r_data_db_err, r_data_db_res] = await db.one(r_dat_db_query).then(data => {return [false, data]}).catch(err => {return [true, err]});

  if(r_data_db_err) {
    //todo render an error page
    console.log("PLEASE FIX ERROR NEAR LINE 186")
    return;
  }

  let r_rev_db_query = `SELECT * FROM ratings WHERE restaurant_id=${req.params.rid}`
  let [r_rev_db_err, r_rev_db_res] = await db.any(r_rev_db_query).then(data => {return [false, data]}).catch(err => {return [true, err]});

  if(r_rev_db_err) {
    //todo render an error page
    console.log("PLEASE FIX ERROR NEAR LINE 195")
    return;
  }
  // Data in restaurant_data
  //{
  //  restaurant_id: 1,
  //  name: 'Admins cool empty place',
  //  image_url: 'nowhere.com',
  //  owner_id: 1
  //}


  // Data in restaurant_reviews
  //[
  //  {
  //    rating_id: 1,
  //    restaurant_id: 1,
  //    user_id: 1,
  //    last_updated: 2023-04-19T13:05:06.000Z,
  //    uploaded: 2023-04-19T13:05:06.000Z,
  //    rating_number: '3.5',
  //    review: 'I went to this place, and I did not have permision to read the menu...staff were helpful at least.'
  //  }
  //]

  res.render("pages/restaurant", {restaurant_data: r_data_db_res, restaurant_reviews: r_rev_db_res})
})



function exists(option) {
  return option != null || option != undefined;
}

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