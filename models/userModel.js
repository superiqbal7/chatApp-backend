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
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            }
        }
    ],
    followers: [
        {
            follower: {
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            }
        }
    ],
    notifications: [
        {
            senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            message: { type: String},
            viewProfile: { type: Boolean, default: false},
            created: {type: Date, default: Date.now()},
            read: {type: Boolean, default: false},
            date: {type: String, default: ''}
        }
    ],
    chatList: [
        {
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            msgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
        }
    ],
    picVersion: { type: String, default: '1605180742' },
    picId: { type: String, default: 'mr-peanutbutter_gd2acc.jpg' },
    images: [
        {
            imgId: { type: String, default: '' },
            imgVersion: { type: String, default: '' }
        }
    ],
})

module.exports = mongoose.model('User', userSchema)
