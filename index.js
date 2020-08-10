const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//Used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
//extract style and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//MongoStore is used to store the session cookie in the db
app.use(session({
    name: 'SocialPal',
    //Todo change the secret before deployment (secret is a key to encode and decode during encryption)
    secret: 'xyz',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)//how long till when cookie expires(in milliseconds)
    },
    store: new MongoStore({
        mongooseConnection: db,    
        autoRemove: 'disabled'    
      },
      function(err){
          console.log(err || 'connect-mongodb setup ok');
      }
      )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//Use express router
app.use('/', require('./routes/index.js'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`)
    }

    console.log(`Server is running on port: ${port}`);
});