import connectDB from '../../../utils/connectDB';

export default async function handler(req, res) {
    const {client, db} = await connectDB();
    if (db) {
      const users = db.collection('users');
      const usersData = [
        {username: 'inolab', password: 'collablab', type: 'supervisor'},
        {username: 'user1', password: 'user1', type: 'student'},
        {username: 'user2', password: 'user2', type: 'student'},
        {username: 'user3', password: 'user3', type: 'student'}
      ]
      const result = await users.insertMany(usersData, {});
      console.log(`${result.insertedCount} documents were inserted`);
      client.close();
      res.status(200).json({ status: 'success' });
    } else {
      res.status(200).json({ status: 'failed' });
    }
}
  