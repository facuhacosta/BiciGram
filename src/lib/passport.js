const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');
const flash = require('connect-flash');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{
    const rows = await pool.query('SELECT * FROM user WHERE username = ?', [username])
    if (rows.length > 0) {
        const user = rows[0];
        
        const validPassword = await helpers.matchPassword(password, user.pass);
        if (validPassword) {
            done(null, user, req.flash('success','Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message','Incorrect Password'));
        };
    } else {
        return done(null, false, req.flash('message',"User Name doen't exist"));
    };
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { firstname, lastname, bike, email} = req.body;
    const newUser = {
        username,
        pass: password,
        firstname,
        lastname,
        email,
        bike
    }
    newUser.pass = await helpers.encryptPassqord(password);
    const result = await pool.query('INSERT INTO user SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    done(null, rows[0]);
})