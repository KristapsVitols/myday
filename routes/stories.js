const express  = require('express'),
	  router   = express.Router({mergeParams: true}),
	  Story    = require('../models/story'),
	  midware  = require('../midware');

//display all stories
router.get('/', midware.isLoggedIn, (req, res) => {
	Story.find({})
		.sort({"created": "desc"})
		.exec((err, stories) => {
		if(err){
			console.log(err);
		} else {
			Story.find({})
				.sort({"views": "desc"})
				.limit(5)
				.exec((err, viewstories) => {
				if(err){
					console.log(err);
				} else {
					res.render('stories/stories', {stories: stories, viewstories: viewstories});
				}
			});
		}
	});
});

//show 'new' story form
router.get('/new', midware.isLoggedIn, (req, res) => {
	res.render('stories/new');
});

//add story 
router.post('/', midware.isLoggedIn, (req, res) => {
	const author = {
		id: req.user._id,
		username: req.user.username
	}

	const newStory = {title: req.body.title, description: req.body.description, author: author, views: 0}

	if(req.body.title.length === 0 || req.body.description.length === 0) {
		req.flash("error", "Lūdzu aizpildiet visus lauciņus!");
		res.redirect('back');
	} else {
	Story.create(newStory, (err, newStory) => {
		if(err){
			res.redirect('/stories');
		} else {
			req.flash("success", "Ieraksts pievienots!");
			res.redirect(`/stories/${newStory._id}`);
		}
	});
	}
});

//show story full
router.get('/:id', midware.isLoggedIn, (req, res) => {
	Story.findById(req.params.id).populate('comments').exec((err, foundStory) => {
		if(err){
			console.log(err);
		} else {
			foundStory.views += 1;
			foundStory.save();
			res.render('stories/show', {story: foundStory});
		}
	});
});

//show 'edit' story form
router.get('/:id/edit', midware.StoryOwnership, (req, res) => {
	Story.findById(req.params.id, (err, foundStory) => {
		if(err){
			console.log(err);
		} else {
			res.render('stories/edit', {story: foundStory});
		}
	});
});

//Update story
router.put('/:id', midware.StoryOwnership, (req, res) => {
	if(req.body.story.title.length === 0 || req.body.story.description.length === 0) {
		req.flash('error', 'Lūdzu aizpildiet visus lauciņus!');
		res.redirect('back');
	} else {
		Story.findByIdAndUpdate(req.params.id, req.body.story, (err, updateStory) => {
			if(err){
				console.log(err);
			} else {
				req.flash('success', 'Ieraksts veiksmīgi rediģēts!');
				res.redirect(`/stories/${req.params.id}`);
			}
		});
	}
});

//Delete story
router.delete('/:id', midware.StoryOwnership, (req, res) => {
	Story.findByIdAndRemove(req.params.id, (err, deleteStory) => {
		if(err){
			console.log(err);
		} else {
			res.redirect('/stories');
		}
	});
});

module.exports = router;