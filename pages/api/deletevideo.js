import connectDB from '../../utils/connectDB';
import withSession from '../../utils/session';

const deleteVideoDB = async (req, res) => {
  const { videoID } = req.body;
  const {client, db} = await connectDB();
  const loggedInUser = req.session.get('user');
  if (!loggedInUser) {
    res.redirect(307, '/');
  }

  if (db) {
    // insert data to database
    const ObjectID = require('mongodb').ObjectID;
    const videoReport = db.collection('videoreport');
    const videoData = { _id: ObjectID(videoID) };
    const deleted = await videoReport.deleteOne(videoData);
    client.close();
    res.status(200).json({ status: 'success' });
  } else {
    res.status(200).json({ status: 'error' });
  }
}

export default withSession(deleteVideoDB)