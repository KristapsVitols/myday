const express     = require('express'),
	  router      = express.Router({mergeParams: true}),
	  User        = require('../models/user'),
	  passport    = require('passport');


//ROUTES
router.get('/', (req, res) => {
	if(req.user) {
		res.redirect('/stories');
	} else {
		res.render('index');			
	}
});

//Sign up
router.post('/register', (req, res) => {
	const newUser = new User({
		name: req.body.name,
		lastname: req.body.lastname,
		email: req.body.email,
		username: req.body.username,
	});
	if(req.body.password === req.body.password2) {
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			console.log(err);
			return res.render('index', {error: err.message});
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/stories');
		});
	});
	} else {
		req.flash("error", "Paroles nav vienādas!");
		res.redirect('/');
	}
});

//show login form
router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/stories',
	failureRedirect: '/',
	failureFlash: 'Nepareizs lietotājvārds vai parole'
}), (req, res) => {
});

//logout route
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;