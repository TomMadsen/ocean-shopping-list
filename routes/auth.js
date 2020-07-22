const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwtGenerator = require('../utils/jwtGenerator');
const validator = require('../middleware/validator');
const authorizer = require('../middleware/authorizer');

router.post('/register', validator, async(req, res)=>{
  try {
    // test if user exists
    const {name, email, password} = req.body;
    const user = await pool.query(`
      SELECT * FROM users WHERE user_email = $1`,[
      email
    ]);
    if(user.rows.length !== 0){
     return res.status(401).json('Cannot register with that email - it already exists on the database')
    }
    // if no user already exists, bcrypt the password and set the newUser
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashPWD = await bcrypt.hash(password, salt);

    const newUser = await pool.query(`
      INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *`,[
        name, email, hashPWD
      ]);
    // get the user id
    // res.json(newUser.rows[0])
    // create and return a token
    const token = await jwtGenerator(newUser.rows[0].uid);
    res.json({token})

  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error')
  }
});

router.post('/login', validator, async(req, res)=>{
  try {
    // test if user exists
    const {email, password} = req.body;
    const user = await pool.query(`
      SELECT * FROM users WHERE user_email = $1`,[
      email
    ]);
    if(user.rows.length === 0){
     return res.status(401).json('Cannot find a user with that email')
    };
    // since email matches, validate the password.
    const validPWD = await bcrypt.compare(password, user.rows[0].user_password);
    if (!validPWD){
      return res.status(401).json('Incorrect Password')
    }
    const token = await jwtGenerator(user.rows[0].uid);
    res.json({token})

  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error')
  }
});

router.get('/is-auth', authorizer, async (req, res)=>{
  try {
    res.json(true)
  } catch (error) {
    res.status(401).json('Token has expired, please login again')
  }
})

module.exports = router;