const HttpStatus = require('http-status-codes');

const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');

module.exports = {
   SendMessage(req, res) {
    const { sender_Id, receiver_Id } = req.params;

    Conversation.find({
      $or: [
        { 
          participants: {
            $elemMatch: { senderId: sender_Id, receiverId: receiver_Id}
          }
        },
        {
          participants: {
            $elemMatch: { senderId: receiver_Id, receiverId: sender_Id}
          }
        }
      ]
    }, async (err, result) => {
      if(result.length > 0){

      } else {
        const newConversation = new Conversation();
        newConversation.participants.push({
          senderId: req.user._id,
          receiverId: req.params.receiver_Id
        });

        const saveConversation = await newConversation.save();

        const newMessage = new Message();
        newMessage.conversationId = saveConversation._id;
        newMessage.sender = req.user.username;
        newMessage.receiver = req.body.receiverName;
        newMessage.message.push({
          senderId: req.user._id,
          receiverId: req.params.receiver_Id,
          senderName: req.user.username,
          receiverName: req.body.receiverName,
          body: req.body.message
        });

        await User.update({
          _id: req.user._id
        },{
          $push: {
            chatList: {
              $each: [
                {
                  receiverId: req.params.receiver_Id,
                  msgId: newMessage._id
                }
              ],
              $position: 0
            }
          }
        })

        await User.update({
          _id: req.params.receiver_Id 
        }, {
          $push: {
            chatList: {
              $each: [
                {
                  receiverId: req.user._id,
                  msgId: newMessage._id
                }
              ],
              $position: 0
            }
          }
        })

        await newMessage()
          .save()
          .then(()=>{
            res.staus(HttpStatus.OK).json({ message: 'Message sent'})
          })
          .catch(err => 
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured'})
            )
      }
    }
    )
  }
}
