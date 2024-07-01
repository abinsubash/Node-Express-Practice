var express = require('express');
var router = express.Router();

const credential = {
    email: "admin@gmail.com",
    password: "admin123"
};

// Login user
router.post('/login', (req, res) => {
    if (req.body.email === credential.email && req.body.password === credential.password) {
        req.session.user = req.body.email;
        res.redirect('/route/dashboard');
    } else {
        res.redirect('/?error=Invalid Username or Password');
    }
});

// Dashboard route
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { title: "Dashboard", user: req.session.user });
    } else {
        res.send('Unauthorized User');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/route/dashboard');
        }
        res.redirect('/?logout=success');
    });
});

module.exports = router;
