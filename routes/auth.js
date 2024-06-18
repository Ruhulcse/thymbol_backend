const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google-login', (req, res) => {
    //res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
    res.send({
        href: 'localhost:5000/google',
        error: false,
        statusCode: 200,
    });
});
router.get(
    '/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FN_HOST}/login`,
        session: false,
    }),
    (req, res) => {
        // Successful authentication, return the user object
        if (req.user) {
            //res.status(200).send({data:req.user, message: "Authentication Successfull!", statusCode: 200})
            //res.json({data:req.user, message: "Authentication Successfull!", statusCode: 200}); // Respond with the authenticated user
            res.redirect(
                `${process.env.FN_HOST}/auth/success?user=${encodeURIComponent(
                    JSON.stringify(req.user)
                )}`
            );
        } else {
            res.redirect(
                `${process.env.FN_HOST}/login?error=Authentication Failed`
            );
        }
        //res.redirect(`${process.env.FN_HOST}/dashboard`);
    }
);

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/auth/success', (req, res) => {
    // This route handles the redirection from Google callback with user data
    const user = req.query.user ? JSON.parse(req.query.user) : null;
    res.status(200).json({
        data: user,
        message: 'Authentication Successful!',
        statusCode: 200,
    });
});

module.exports = router;
