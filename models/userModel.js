const mongoose = require('mongoose');
const { string, boolean } = require('joi');

const userSchema = mongoose.Schema({
    name: {type: String},
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
    ],
    notifications: [
        {
            senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            message: { type: String},
            viewProfile: { type: Boolean, default: false},
            created: {type: Date, default: Date.now()},
            read: {type: Boolean, default: false},
            date: {type: String, default: ''}
        }
    ],
    chatList: [
        {
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            msgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
        }
    ],
    picVersion: { type: String, default: '' },
    picId: { type: String, default: '' },
    images: [
        {
            imgId: { type: String, default: '' },
            imgVersion: { type: String, default: '' }
        }
    ],
})

module.exports = mongoose.model('user', userSchema)
