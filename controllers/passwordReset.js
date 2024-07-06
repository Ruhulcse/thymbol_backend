const User = require('../models/userModel');
const PasswordReset = require('../models/passwordResetModel');
const { v4 } = require('uuid');
const mongoose = require("mongoose");
const { sendEmail } = require('../helpers');

const getResetTemplate = async (req, res) => {
    console.log("req.flash()", res.locals.messages);
    const messages = {
        success: "",
        error: "",
        email: ""
    };
    res.render('reset', { messages: Object.keys(res.locals.messages).length ? res.locals.messages : messages })
}
const sendResetLink = async (req, res) => {
    /* Flash email address for pre-population in case we redirect back to reset page. */
    req.flash('email', req.body.email)
    console.log('req.body.emailreq.body.emailreq.body.emailreq.body.email', req.body.email)
    /* Check if user with provided email exists. */
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        req.flash('error', 'User not found')
        return res.redirect('/reset')
    }

    /* Create a password reset token and save in collection along with the user. 
       If there already is a record with current user, replace it. */
    const token = v4().toString().replace(/-/g, '')
    PasswordReset.updateOne({
        user: user._id
    }, {
        user: user._id,
        token: token
    }, {
        upsert: true
    })
        .then(updateResponse => {
            /* Send email to user containing password reset link. */
            const resetLink = `${process.env.API_HOST}/reset-confirm/${token}`
            console.log(resetLink)
            const emailContent = `
  Hi ${user.firstName ? user.firstName : user.userName},
  <br><br>
  Here's your password reset link:
  <br>
  <a href="${resetLink}">${resetLink}</a>
  <br><br>
  If you did not request this link, please ignore this email.
`;
            //send email with reset link
            sendEmail({
                to: user.email,
                subject: 'Password Reset',
                html: emailContent
            })

            req.flash('success', 'Check your email address for the password reset link!')
            return res.redirect('/reset');
        })
        .catch(error => {
            req.flash('error', 'Failed to generate reset link, please try again')
            return res.redirect('/reset')
        })
};

const sendResetConfirmTemplate = async (req, res) => {
    const token = req.params.token
    const passwordReset = await PasswordReset.findOne({ token })
    const messages = Object.keys(res.locals.messages).length ? res.locals.messages : {};
    res.render('reset-confirm', {
        token: token,
        valid: passwordReset ? true : false,
        messages: messages
    })
}

const confirmPasswordReset = async (req, res) => {
    const token = req.params.token
    const passwordReset = await PasswordReset.findOne({ token })
    if (!passwordReset) {
        return res.status(404).send('Invalid Token!')
    }
    /* Update user */
    let user = await User.findOne({ _id: passwordReset.user })
    user.password = req.body.password
    let name = user.firstName;
    if (!name) {
        name = user.userName
    }
    user.save().then(async savedUser => {
        /* Delete password reset document in collection */
        await PasswordReset.deleteOne({ _id: passwordReset._id })
        /* Send successful password reset email */
        sendEmail({
            to: user.email,
            subject: 'Password Reset Successful',
            text: `Congratulations ${name
                }! Your password reset was successful.`
        })

        /* Redirect to login page with success message */
        req.flash('success', 'Password reset successful')
        res.redirect(`${process.env.FN_HOST}/login`);
    }).catch(error => {
        /* Redirect back to reset-confirm page */
        req.flash('error', 'Failed to reset password please try again')
        return res.redirect(`/reset-confirm/${token}`)
    })
}

module.exports = {
    getResetTemplate,
    sendResetLink,
    sendResetConfirmTemplate,
    confirmPasswordReset
}


