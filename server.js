const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache');
const router = require('./router');

const app = express();
const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecretKeyHere', // Use an environment variable in production
    resave: false,
    saveUninitialized: true
}));

// No-cache middleware
app.use(nocache());

// Additional headers to prevent caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Router middleware
app.use('/route', router);

// Home route
app.get('/', (req, res) => {
    if(req.session.user){
        res.render('dashboard', { title: "Dashboard", user: req.session.user })
    }else{
        const logoutSuccess = req.query.logout === 'success';
        const error = req.query.error;
        res.render('base', { title: "Login System", logoutSuccess, message: error });
    }
});

// Error handling middleware (if needed)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Listening to the server on http://localhost:${port}`);
});
