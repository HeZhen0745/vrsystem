import connectDB from '../../../utils/connectDB';

export default async function handler(req, res) {
    const {client, db} = await connectDB();
    if (db) {
      const videoReport = db.collection('videoreport');
      const videosData = [
        {file: 'video_report1', user: 'inolab', uploadDate: Date.now()}, 
        {file: 'video_report2', user: 'inolab', uploadDate: Date.now()}, 
        {file: 'video_report3', user: 'inolab', uploadDate: Date.now()}, 
        {file: 'video_report4', user: 'inolab', uploadDate: Date.now()}, 
        {file: 'video_report5', user: 'inolab', uploadDate: Date.now()}, 
        {file: 'video_report6', user: 'inolab', uploadDate: Date.now()}
      ]
      const result = await videoReport.insertMany(videosData, {});
      console.log(`${result.insertedCount} documents were inserted`);
      client.close();
      res.status(200).json({ status: 'success' });
    } else {
      res.status(200).json({ status: 'failed' });
    }
}
  