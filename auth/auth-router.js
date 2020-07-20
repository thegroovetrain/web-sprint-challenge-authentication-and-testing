const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const model = require('./auth-model')

router.post('/register', async (req, res) => {
  try {
    const {username, password} = req.body
    const user = await model.findBy({username}).first()

    if (user) {
      return res.status(409).json({
        message: "Username already taken."
      })
    }

    const newUser = await model.add({
      username,
      password: await bcrypt.hash(password, 14)
    })

    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong.",
      error: err
    })
    console.log(err)
  }
});

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body
    const user = await model.findBy({username}).first()

    if (!user) {
      return res.status(401).json({
        message: "Access denied!"
      })
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return res.status(401).json({
        message: "Access denied!"
      })
    }

    const payload = {
      userId: user.id,
      username: user.username,
      department: user.department
    }

    const options = {
      expiresIn: '1d'
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, options)

    res.json({
      message: `Welcome, ${user.username}!`,
      token: token
    })
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong.",
      error: err
    })
    console.log(err)
  }
});

module.exports = router;
