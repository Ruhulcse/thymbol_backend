const router = require('express').Router();
const { sendResetLink, sendResetConfirmTemplate, confirmPasswordReset, getResetTemplate } = require('../controllers/passwordReset')

//router.get('/reset', (req, res) => res.render('reset.html'));
router.route('/reset').get(getResetTemplate)
router.route('/reset').post(sendResetLink)
router.route('/reset-confirm/:token').get(sendResetConfirmTemplate);
router.route('/reset-confirm/:token').post(confirmPasswordReset)

module.exports = router