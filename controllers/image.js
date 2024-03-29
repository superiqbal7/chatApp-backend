const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');

const User = require('../models/userModel');

cloudinary.config({
  cloud_name: 'djhzlslux',
  api_key: '572662329741249',
  api_secret: 'ROuApg2XaJjacNrhZ5B4nK3HszI'
});

module.exports = {
  UploadImage(req, res) {
    cloudinary.uploader.upload(req.body.image, async result => {
      await User.updateOne(
        {
          _id: req.user._id
        },
        {
          $push: {
            images: {
              imgId: result.public_id,
              imgVersion: result.version
            }
          }
        }
      )
        .then(() =>
          res
            .status(HttpStatus.OK)
            .json({ message: 'Image uploaded successfully' })
        )
        .catch(err =>
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error uploading image' })
        );
    });
  },

  async SetDefaultImage(req, res){
    const {imgId, imgVersion } = req.params;
    await User.updateOne(
      {
        _id: req.user._id
      },
      {
        picId: imgId,
        picVersion: imgVersion
      }
    )
      .then(() =>
        res
          .status(HttpStatus.OK)
          .json({ message: 'Profile picture updated' })
      )
      .catch(err =>
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error uploading profile picture' })
      );
  }
};
