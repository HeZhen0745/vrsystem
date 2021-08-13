import connectDB from '../../utils/connectDB';
import withSession from '../../utils/session';

const authUser = async (req, res) => {
  const {client, db} = await connectDB();
  const {username, password} = req.body;
  const dbQuery = { username: username, password: password };
  // console.log(dbQuery);
  try {
    const users = db.collection('users');
    const findUser = await users.findOne(dbQuery, {});
    if (findUser) {
      const sessiondata = { isLoggedIn: true, user: findUser }
      req.session.set('user', sessiondata);
      await req.session.save();
      res.json(sessiondata);
    } else {
      res.json({status: 'failed', message: 'Username/password not found'});
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

export default withSession(authUser)
  