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


const events = `
  SELECT DISTINCT
    events.event_id,
    events.event_title,
    events.event_description,
    events.restaurant,
    events.day,
    events.time AS events
  FROM 
    events
`

const deals = `
  SELECT DISTINCT
    deals.deal_id,
    deals.deal_title,
    deals.deal_description,
    deals.restaurant,
    deals.day,
    deals.time AS deals
  FROM 
    deals
`

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

    const userReg = 'INSERT INTO users (username, pswd) VALUES ($1, $2) RETURNING *;';
    const ownerReg = `INSERT INTO owners (owner_id) (SELECT user_id FROM users WHERE users.username = $1) RETURNING *;`;

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
        // console.log(data)
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

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const date = new Date(Date.now());
  //console.log(date);
  const currentDay = days[date.getDay()];
  //console.log(currentDay);

  const topRestaurantsQuery = `SELECT r.restaurant_id, r.name, r.image_url, ROUND(AVG(rt.rating_number), 1) AS avg_rating FROM restaurants r JOIN ratings rt ON r.restaurant_id = rt.restaurant_id GROUP BY r.restaurant_id, r.name, r.image_url ORDER BY COUNT(rt.rating_id) DESC LIMIT 4;`;
  const highestRatedQuery = `SELECT r.restaurant_id, r.name, r.image_url, ROUND(AVG(rt.rating_number), 1) AS avg_rating FROM restaurants r JOIN ratings rt ON r.restaurant_id = rt.restaurant_id GROUP BY r.restaurant_id, r.restaurant_id ORDER BY avg_rating DESC LIMIT 4;`;
  const weeksEventsQuery = `SELECT r.restaurant_id, r.name, r.image_url, e.event_title, ROUND(AVG(rt.rating_number), 1) AS avg_rating FROM restaurants AS r JOIN events AS e ON r.restaurant_id = e.restaurant_id LEFT JOIN ratings AS rt ON r.restaurant_id = rt.restaurant_id WHERE e.day LIKE '%${currentDay}%' GROUP BY r.restaurant_id, r.name, r.image_url, e.event_title ORDER BY RANDOM() LIMIT 4;`;
  const dailyDealsQuery = `SELECT r.restaurant_id, r.name, r.image_url, d.deal_title, ROUND(AVG(rt.rating_number), 1) AS avg_rating FROM restaurants AS r JOIN deals AS d ON r.restaurant_id = d.restaurant_id LEFT JOIN ratings AS rt ON r.restaurant_id = rt.restaurant_id WHERE d.day LIKE '%${currentDay}%' GROUP BY r.restaurant_id, r.name, r.image_url, d.deal_title ORDER BY RANDOM() LIMIT 4;`;
  
  db.task('do-everything', task => {
    return task.batch([
      task.any(topRestaurantsQuery, []),
      task.any(highestRatedQuery, []),
      task.any(weeksEventsQuery, []),
      task.any(dailyDealsQuery, [])
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
  const deals = `SELECT 
    deals.deal_title, 
    deals.day,
    deals.time,
    deals.deal_description,
    restaurants.image_url,
    restaurants.name AS restaurant_name
    FROM 
    deals 
    JOIN restaurants ON deals.restaurant_id = restaurants.restaurant_id
    ORDER BY time ASC;`;

  db.task('do-everything', task =>{
    return task.batch([
      task.any(deals, []),
    ])
  })
    .then(data => {
      console.log(data)
      res.render('pages/deals', {data})
    })
    .catch(function (err){
      console.log(err);
      data = [];
      res.render('pages/calendar', {data})
    });
});

app.get('/calendar', (req, res) => {
  res.render('pages/calendar');
});

app.get('/events', (req, res) => {
  const events = `SELECT 
    events.event_title, 
    events.day,
    events.time,
    restaurants.image_url,
    restaurants.name AS restaurant_name
   FROM 
    events 
    JOIN restaurants ON events.restaurant_id = restaurants.restaurant_id
   ORDER BY time ASC;`;

  db.task('do-everything', task =>{
    return task.batch([
      task.any(events, []),
    ])
  })
    .then(function(data){
      console.log(data)
      res.render('pages/events', {data})
    })
    .catch(function (err){
      console.log("failed")
      res.render('pages/calendar', {data})
    });
});

app.get('/events/filter', (req, res) =>{
  
  if (req.body.trivia == true) {
    trivia_val = '%zzz%';
  } else {
    trivia_val = '%rivia%';
  }

  if (req.body.bingo == true) {
    var bingo_val = '%zzz%';
  } else {
    var bingo_val = '%ingo%';
  }

  if (req.body.gamenight == true) {
    var game_val = '%zzz%';
  } else {
    var game_val = '%ame%';
  }

  if (req.body.livemusic == true) {
    var music_val = '%zzz';
  } else {
    var music_val = '%usic%';
  }
  const events = `SELECT 
    events.event_title, 
    events.day,
    events.time,
    restaurants.image_url,
    restaurants.name AS restaurant_name
   FROM 
    events 
    JOIN restaurants ON events.restaurant_id = restaurants.restaurant_id
   WHERE events.event_title LIKE '${trivia_val}' OR events.event_title LIKE '${bingo_val}'
   ORDER BY time ASC;`;

   db.task('do-everything', task =>{
    return task.batch([
      task.any(events, []),
    ])
  })
    .then(function(data){
      console.log(data)
      res.render('pages/events', {data})
    })
    .catch(function (err){
      console.log("failed")
      res.redirect('pages/discover', {data})
    });

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
    await res.send("Rid needs to exist")
    return;
  }

  console.log(`rid: ${req.params.rid}`)
  var r_dat_db_query = `SELECT * FROM restaurants WHERE restaurant_id=${req.params.rid}`

  let [r_data_db_err, r_data_db_res] = await db.one(r_dat_db_query).then(data => {return [false, data]}).catch(err => {return [true, err]});

  if(r_data_db_err) {
    //todo render an error page
    console.log("PLEASE FIX ERROR NEAR LINE 186")
    await res.send("Database err")
    return;
  }

  let r_rev_db_query = `SELECT * FROM ratings WHERE restaurant_id=${req.params.rid}`
  let [r_rev_db_err, r_rev_db_res] = await db.any(r_rev_db_query).then(data => {return [false, data]}).catch(err => {return [true, err]});

  if(r_rev_db_err) {
    //todo render an error page
    console.log("PLEASE FIX ERROR NEAR LINE 195")
    await res.send("Database err")
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

  let client = yelp.client(process.env.API_KEY);
  const searchRequest = {
    location: 'boulder, co',
    name: r_data_db_res,
  };
  
  let [yelpErr, yelpData] = await client.search(searchRequest)
  .then(results => {
    return [false, results]
  })
  .catch(error => {
    return [true, error]
  });

  if(yelpErr) {
    console.log(`yelp err: ${yelpData}`)
    res.send("Unable to lookup yep data")
    return;
  }

  var safe_yelp = {
    rating: 4.5,
    location: {
      address1: '1011 Walnut St',
      address2: '',
      address3: '',
      city: 'Boulder',
      zip_code: '80302',
      country: 'US',
      state: 'CO',
      display_address: [ '1011 Walnut St', 'Boulder, CO 80302' ]
    },
    phone: "(303) 998-1010"
  } 
  if(exists(yelpData.jsonBody.businesses[0])) {
    let yelp = yelpData.jsonBody.businesses[0];
    safe_yelp.rating = yelp.rating;
    safe_yelp.location = yelp.location;
    safe_yelp.phone = yelp.display_phone
  }

  let avg_query = `select AVG(rating_number) from ratings where restaurant_id=${req.params.rid};`
  let [avgErr, avgDat] = await db.one(avg_query).then(dat => {return [false, dat];}).catch(err => {return [true, err];})

  if(avgErr) {
    console.log(`Err getting avg: ${avgDat}`)
    res.send("Error getting internal rating.")
  }

  res.render("pages/restaurant", {restaurant_rating: avgDat, restaurant_data: r_data_db_res, restaurant_reviews: r_rev_db_res, yelp_data: safe_yelp})
})


const RatingResult = {
  NoReview: 0,
  UserHasReview: 1,
  DatabaseErr: 2
}


app.post("/ratings/:rid", async (req, res) => {

  if(!exists(req.session.user)) {
      console.log("Handle error near line 318")
      await res.send("You must be signed in to post reviews");
      return;
  }


  // check that the user does not allready have a review
  let duplicationQuerry = `SELECT * FROM ratings WHERE restaurant_id=${rid} AND user_id=${req.session.user.user_id};`;
  let [dupRes, data] = await db.any(duplicationQuerry).then(data => {
    if(data.length == 0) {
      return [RatingResult.NoReview, data]
    } else {
      return [RatingResult.UserHasReview, data]
    }
  }).catch(err => {return [RatingResult.DatabaseErr, err]})


  if(dupRes == RatingResult.DatabaseErr) {
    console.log("Handle error near line 336")
    console.log(`Db err: ${data}`)

    await res.send("A database error has occured");
    return;
  }

  if(dupRes == RatingResult.UserHasReview) {
    await res.send("User allready has review, perhaps you meant to update it?")
    return;
  }

  if(!exists(req.body.rating)) {
    console.log("handle err near line 349")
    await res.send("Please send a \"rating\" object in the body of your message")
    return;
  }

  let rating = req.body.rating
  let now = Date.now()
  let now_str = `to_timestamp(${now.toString()})`
  // insert the review
  let review_insert_querry = `INSERT INTO ratings (restaurant_id, user_id, last_updated, uploaded, rating_number, review) VALUES (${rid}, ${req.session.user.user_id}, ${now_str}, ${now_str}, ${rating.number}, '${rating.review}');` 
  let [dbErr, dbRes] = await db.any(review_insert_querry).then(dat => {[false, dat]}).catch(err => {[true, err]})
  if(dbErr) {
    console.log("handle err near line 361")
    console.log(`db err: ${dbRes}`)
    await res.send("A database error has occured")
    return;
  }

  await res.send("Added review!")
});

app.delete("/ratings/:rid", async (req, res) => {
  if(!exists(req.session.user)) {
    console.log("Handle error near line 310")
    await res.send("You must be signed in to post reviews");
    return;
  }
  
  // check that the user does allready have a review
  let [dupRes, data] = await db.any(duplicationQuerry).then(data => {
  let duplicationQuerry = `SELECT * FROM ratings WHERE restaurant_id=${rid} AND user_id=${req.session.user.user_id};`;
  if(data.length == 0) {
    return [RatingResult.NoReview, data]
  } else {
    return [RatingResult.UserHasReview, data]
  }
  }).catch(err => {return [RatingResult.DatabaseErr, err]})


  if(dupRes == RatingResult.DatabaseErr) {
    console.log("Handle error near line 390")
    console.log(`Db err: ${data}`)

    await res.send("A database error has occured");
    return;
  }


  if(dupRes == RatingResult.NoReview) {
    console.log("Handle error near line 399")
    await res.send("User has no review to delete");
    return;
  }

  let del_query = `DELETE FROM ratings WHERE restaurant_id=${rid} AND user_id=${req.session.user.user_id};`
  let [dbErr, dbRes] = await db.any(del_query).then(dat => {[false, dat]}).catch(err => {[true, err]})
  if(dbErr) {
    console.log("handle err near line 407")
    console.log(`db err: ${dbRes}`)
    await res.send("A database error has occured")
    return;
  }
  
  await res.send("Deleted successfully")
});

app.put("/ratings/:rid", async (req, res) => {
  if(!exists(req.session.user)) {
    console.log("Handle error near line 417")
    await res.send("You must be signed in to post reviews");
    return;
  }

  if(!exists(req.body.rating)) {
    await res.send("You must supply a \"rating\" object.")
    return;
  }

  let now = Date.now()
  let now_str = `to_timestamp(${now.toString()})`
  // insert the review
  let review_update_querry = `UPDATE ratings SET last_updated=${now_str}, rating_number=${rating.number}, review='${rating.review}' WHERE restaurant_id=${rid} AND user_id=${req.session.user.user_id};` 
  let [dbErr, dbRes] = await db.any(review_update_querry).then(dat => {[false, dat]}).catch(err => {[true, err]})
  if(dbErr) {
    console.log("handle err near line 433")
    console.log(`db err: ${dbRes}`)
    await res.send("A database error has occured")
    return;
  }


  await res.send("Updated sucessfully")
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