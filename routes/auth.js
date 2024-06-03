const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google-login', (req, res) => {
  //res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
  res.send({
    href: "localhost:5000/auth/google",
    error: false,
    statusCode: 200
  })
});
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
           // Successful authentication, return the user object
           if (req.user) {
            //res.status(200).send({data:req.user, message: "Authentication Successfull!", statusCode: 200})
            res.json({data:req.user, message: "Authentication Successfull!", statusCode: 200}); // Respond with the authenticated user
        } else {
            res.status(400).send({data:undefined, message: "Authentication Failed!", statusCode: 400});
        }
    res.redirect(`${process.env.FN_HOST}/dashboard`);
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
