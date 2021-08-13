export default async function connectDB() {
    const { MongoClient } = require("mongodb");
    // set database name to connect
    const dbName = 'videoreport'
    // Connection URI
    const uri ="mongodb://localhost:27017/" + dbName;
    // Create a new MongoClient
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      // Connect the client to the server
      await client.connect();
      // Establish and verify connection
      await client.db(dbName).command({ ping: 1 });
      console.log("Connected successfully to server");
      return { client: client, db: client.db(dbName) };
    } catch(error) {
      await client.close();
      console.log(error);
      return false;
    }
}
