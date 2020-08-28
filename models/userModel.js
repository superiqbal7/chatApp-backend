const mongoose = require('mongoose');
const { string } = require('joi');

const userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    posts: [
        {
            postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
            post: { type: String },
            created: { type: Date, default: Date.now() }
        }
    ],
    following: [
        {
            userFollowed: {
                type: mongoose.Schema.Types.ObjectId, ref: 'user'
            }
        }
    ],
    followers: [
        {
            follower: {
                type: mongoose.Schema.Types.ObjectId, ref: 'user'
            }
        }
    ]
})

module.exports = mongoose.model('user', userSchema)
