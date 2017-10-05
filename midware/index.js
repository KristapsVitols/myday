const Story = require('../models/story');
const Comment = require('../models/comment');

const midware = {}

midware.StoryOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Story.findById(req.params.id, (err, story) => {
			if(err || !story) {
				res.redirect('back');
			} else {
				if(story.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
}

midware.CommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, comment) => {
			if(err || !comment) {
				res.redirect('back');
			} else {
				if(comment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		res.redirect('back');
	}
}


midware.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

module.exports = midware;