const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { nextTick } = require('process');
const { database } = require('./keys');
const passport = require('passport');

/* initializations */
require('./lib/passport');
const app = express();


/* Settings */
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

/* Middlewares */
app.use(flash());
app.use(express.json({ type: 'text/html' }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'FacuBicigram',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(database)
}));


app.use(morgan('dev'));



/* Global Variables */
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

/* Routes */

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/foro',require('./routes/foro'));

/* Public */
app.use(express.static(path.join(__dirname,'public')));

/* Starting Server */
app.listen(app.get('port'), () => {
    console.log('server on port: ', app.get('port'));
});