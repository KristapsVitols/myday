const express     = require('express'),
	  router      = express.Router({mergeParams: true}),
	  Story       = require('../models/story'),
	  Comment     = require('../models/comment'),
	  midware     = require('../midware');


//show 'new' comment form
router.get('/new', midware.isLoggedIn, (req, res) => {
	Story.findById(req.params.id, (err, story) => {
		if(err){
			console.log(err);
		} else {
			res.render('comments/new', {story: story});
		}
	});
});

//add new comment
router.post('/', midware.isLoggedIn, (req, res) => {
	Story.findById(req.params.id, (err, story) => {
		if(err){
			console.log(err);
		} else {
			if(req.body.comment.text.length === 0) {
				req.flash("error", "Lūdzu aizpildiet lauciņu!");
				res.redirect('back');
			} else {
				Comment.create(req.body.comment, (err, newComment) => {
					if(err){
						console.log(err);
					} else {
						newComment.author.id = req.user._id;
						newComment.author.username = req.user.username;
						newComment.save();
						story.comments.push(newComment);
						story.save();
						req.flash("success", "Komentārs pievienots!");
						res.redirect(`/stories/${req.params.id}`);
					}
				});
			}
		}
	});
});

//show 'edit' comment form
router.get('/:comment_id/edit', midware.CommentOwnership, (req, res) => {
	Story.findById(req.params.id, (err, foundStory) => {
		if(err){
			console.log(err);
		}
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err){
				console.log(err);
			} else {
				res.render('comments/edit', {story_id: req.params.id, comment: foundComment});
			}
		});
	});
});

//update comment
router.put('/:comment_id', midware.CommentOwnership, (req, res) => {
	if(req.body.comment.text.length === 0) {
		req.flash("error", "Lūdzu aizpildiet lauciņu!");
		res.redirect('back');
	} else {
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment) => {
			if(err){
				console.log(err);
			} else {
				req.flash('success', 'Komentārs rediģēts!');
				res.redirect(`/stories/${req.params.id}`);
			}
		});
	}
});

//delete comment
router.delete('/:comment_id', midware.CommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, deleteComment) => {
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Komentārs dzēsts!");
			res.redirect(`/stories/${req.params.id}`);
		}
	});
});

module.exports = router;