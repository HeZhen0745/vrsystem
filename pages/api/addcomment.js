import connectDB from '../../utils/connectDB';
import withSession from '../../utils/session';

const addComment = async (req, res) => {
    const {client, db} = await connectDB();
    const { comment, videoID } = req.body;
    const loggedInUser = req.session.get('user');
    if (!loggedInUser) {
      res.redirect(307, '/');
    }

    if (db) {
      const ObjectID = require('mongodb').ObjectID; 
      const videoReport = db.collection('videoreport');
      const filter = { _id: ObjectID(videoID) };
      const updateData = {
        $set: {
            comment: comment
        }
      }
      const result = await videoReport.updateOne(filter, updateData, {});
      client.close();
      if (result.matchedCount > 0) {
        res.status(200).json({ status: 'success' });
      } else {
        res.status(200).json({ status: 'failed' });
      }
    } else {
      res.status(200).json({ status: 'error' });
    }
}

export default withSession(addComment)
  