const express= require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/post');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
const db =require('./config/keys').mongoURI;
//Connect to mongoDB
mongoose
  .connect(db,{ useNewUrlParser: true })
  .then(()=>console.log('DB connected'))
  .catch(err=> console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);


//Use routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port = process.env.PORT || 5001;

app.listen(port,()=> console.log(`Running on port ${port}`)); 