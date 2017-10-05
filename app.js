const express         = require('express'),
	  app             = express(),
  	  mongoose        = require('mongoose'),
  	  passport        = require('passport'),
  	  LocalStrategy   = require('passport-local'),
	  port            = process.env.PORT || 5000,
	  methodOverride  = require('method-override'),
	  bodyParser      = require('body-parser'),
	  Comment 		  = require('./models/comment'),
	  User  		  = require('./models/user'),
	  Story           = require('./models/story'),
	  midware         = require('./midware'),
	  moment 		  = require('moment'),
	  flash 		  = require('connect-flash');

//Routes
const storyRoutes     = require('./routes/stories'),
	  commentRoutes   = require('./routes/comments'),
	  indexRoutes     = require('./routes/index');


//Mongoose Connect
const mongoURL = process.env.DBURL || 'mongodb://localhost/myday_app';
mongoose.connect(mongoURL, {useMongoClient: true});
mongoose.Promise = global.Promise;

//Method override
app.use(methodOverride('_method'));
app.use(flash());

//BodyParser
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//EJS view engine 
app.set('view engine', 'ejs');

//Public directory
app.use(express.static(__dirname + '/public'));

//Passport config
app.use(require('express-session')({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Global vars
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.moment = moment;
	next();
});

app.use("/stories", storyRoutes);
app.use("/stories/:id/comments", commentRoutes);
app.use(indexRoutes);

app.get('*', (req, res) => {
	if(req.user) {
		res.redirect('/stories');
	} else {
		res.redirect('/');
	}
});

//Start server
app.listen(port, () => {
	console.log(`server up on ${port}`);
});