const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
  particiapnts: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'}
    }
  ]
});

mondule.exports = mongoose.model('Conversation', ConversationSchema);
