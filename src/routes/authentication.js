const router = require('express').Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

router.get('/signup' , (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }) (req, res, next);
});

/* 
LA VISTA DE ABAJO ES LA MISMA QUE LA COMENTADA DE ARRIBA PERO DEFINIDA
DE MANERA DIFERENTE
*/

/* router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
})); */

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login',async (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn,(req, res) => {
    res.render('profile');
});

router.get('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login')
})

module.exports = router;