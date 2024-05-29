const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
           // Successful authentication, return the user object
           if (req.user) {
            res.status(200).send({data:req.user, message: "Authentication Successfull", statusCode: 200})
            //res.json(req.user); // Respond with the authenticated user
        } else {
            res.status(400).send({data:undefined, message: "Authentication Failed", statusCode: 400});
        }
    //res.redirect('/dashboard');
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
