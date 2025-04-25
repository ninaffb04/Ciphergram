// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');

const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
const qs = require('qs');
const e = require('express');
const { mainModule } = require('process');


// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: process.env.POSTGRES_HOST, // the database server
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

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user; // Makes user available in all templates
  next();
});


app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Flash message middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// allow access to public/images/default-event
app.use(express.static(path.join(__dirname, 'public'))); //add this if it doesn't work: app.use(express.static(path.join(__dirname, 'resources')));
// Serve images from the img folder (located one level above src)
app.use('/img', express.static(path.join(__dirname, '../img')));

// Serve resources (like CSS) from the resources folder inside src
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// Starting the server and keeping the connection open to listen for more requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- API Routes -->
// *****************************************************
app.get('/', (req, res) => {
  res.render('pages/splashPage');
});
// Authentication Middleware?
const auth = (req, res, next) => {
  if (!req.session.user) {
      console.log('User not authenticated. Redirecting to login...');
      return res.redirect('/login');
  }
  next();
};

app.get('/caesar', (req, res) => {
  res.render('pages/caesarCipher');
});



app.listen(3000);
console.log('Server is listening on port 3000');

