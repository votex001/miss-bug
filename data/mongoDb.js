import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://admin:admin@bugscdn.wyzlnoa.mongodb.net/?retryWrites=true&w=majority&appName=BugsCDN"; // Update with your MongoDB URI

const dbName = "BugsProject";

var dbConn;

async function getCollection(collectionName) {
  const db = await _connect();
  return db.collection(collectionName);
}

async function _connect() {
  if (dbConn) return dbConn;
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    dbConn = db;
    return db;
  } catch (err) {
    console.log("Cannot Connect to DB", err);
    throw err;
  }
}

export { getCollection };
