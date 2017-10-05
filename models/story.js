const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

mongoose.Promise = global.Promise;

const storySchema = new mongoose.Schema({
	title: String,
	description: String,
	created: {
		type : Date,
		default: Date.now
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	views: Number,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

storySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Story', storySchema);