const express= require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/post');

const app = express();
//DB config
const db =require('./config/keys').mongoURI;
//Connect to mongoDB
mongoose
  .connect(db,{ useNewUrlParser: true })
  .then(()=>console.log('DB connected'))
  .catch(err=> console.log(err));

app.get('/', (req,res)=>res.send('hello world'));

//Use routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port = process.env.PORT || 5001;

app.listen(port,()=> console.log(`Running on port ${port}`)); 