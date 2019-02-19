const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');

router.get('/test', (req,res)=> res.json({
  msg:"Users works"
}));

//@route register
//@acces public
router.post('/register', (req,res)=>{
  const {errors, isValid} = validateRegisterInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      return res.status(400).json({email: "Email already exists"})
    }else{
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        default: 'mm'
      });
      const newUser = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err,hash) =>{
          if(err) throw err;
          newUser.password = hash;
          newUser
          .save()
          .then(user=> res.json(user))
          .catch(err=> console.log(err))
        })
      });
    }
  })
}); 

//@route /login
//@acces public
router.post('/login', (req,res)=> {
  const {errors, isValid} = validateLoginInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      if(!user){
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
      .then(isMatch =>{
        if(isMatch){
          const payload = {
            id: user.id,
            username: user.username,
            avatar: user.avatar
          }
          jwt.sign(
            payload, 
            keys.secretJWT, 
            {expiresIn: 3600}, 
            (err,token)=>{
              res.json({
                succes:true,
                token: 'Bearer '+token
              });
          });
          // res.json({msg: "Sucess"});
        }else{
          errors.password = "Password doesn't match";
          return res.status(400).json(errors); 
        }
      })
    })
});
//@route /current
//@acces public
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;