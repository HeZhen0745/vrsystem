import multer from 'multer';
import connectDB from '../../utils/connectDB';
import withSession from '../../utils/session';

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDate = Date.now();
var fileName = 'video.webm';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/videos");
  },
  filename: function (req, file, cb) {
    fileName = 'videoreport_' + uploadDate + '.webm';
    cb(null, fileName);
  },
});

const insertVideoDB = async (user, filename) => {
  const {client, db} = await connectDB();
  // insert data to database
  const videoReport = db.collection('videoreport');
  const videoData = {file: filename, user: user, uploadDate: uploadDate, comment: null};
  const inserted = await videoReport.insertOne(videoData, {});
  client.close();
  return inserted;
}

var upload = multer({ storage: storage }).single('videorecording');

export default withSession(async (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.status(500).json({status: 'failed', message: err});
    }

    fileName = 'videoreport_' + uploadDate + '.webm';
    const loggedInUser = req.session.get('user');
    const videoUser = loggedInUser.user.username;
    insertVideoDB(videoUser, fileName);
    // console.log(result);
    res.json({status: 'success', message: req.file});
  });
})