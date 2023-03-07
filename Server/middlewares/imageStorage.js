const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
require('../config/config');

const imageStorage = {};

const conn = mongoose.connection;
imageStorage.gfs = {};

conn.once('open', function () {
    imageStorage.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "images"
    });
})

const storage = new GridFsStorage({
    url: process.env.URI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'images'
          };
          resolve(fileInfo);
        });
      });
    },
    options: {
        useUnifiedTopology: true,
    }
  });

 imageStorage.upload = multer({ storage });

 module.exports = imageStorage;