/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authError = {
    message: 'You shall not pass!'
  }

  try {
    const token = req.body.token
    if (!token) {
      return res.status(401).json(authError)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json(authError)
      }
      next()
    })
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong.",
      error: err
    })
    console.log(err)
  }
};
