import connectDB from '../../utils/connectDB';
import withSession from '../../utils/session';

const videos = async (req, res) => {
  const {client, db} = await connectDB();
  const loggedInUser = req.session.get('user');

  if (!loggedInUser) {
    res.redirect(307, '/');
  }

  // if admin is logged in then no filter, show all video
  var dbQuery = { user: loggedInUser.user.username };
  if (loggedInUser.user.type == 'supervisor') {
    dbQuery = { };
  }

  console.log(dbQuery);
  try {
    const videoReport = db.collection('videoreport');
    const findVideos = await videoReport.find(dbQuery, {sort: { uploadDate: -1 }, limit: 100});
    if ((await findVideos.count()) > 0) {
      const videosArray = await findVideos.toArray();
      // console.log(videosArray);
      res.json(videosArray);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

export default withSession(videos)
  