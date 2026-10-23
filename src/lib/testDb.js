import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_TEST_URI ||
  "mongodb+srv://sarthakp8074_db_user:eIra0uMgdxNJea5x@cluster-csi.cz17liw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-CSI";

let client;
let clientPromise;

if (!global._testMongoClientPromise) {
  client = new MongoClient(uri, {
    maxPoolSize: 25,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });
  global._testMongoClientPromise = client.connect().catch((err) => {
    console.error("MongoDB Aptitude cluster connection error:", err.message);
    delete global._testMongoClientPromise;
    return null;
  });
}
clientPromise = global._testMongoClientPromise;

export async function getTestDb() {
  let mongo = await global._testMongoClientPromise;
  if (!mongo) {
    client = new MongoClient(uri, {
      maxPoolSize: 25,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    global._testMongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB Aptitude reconnect error:", err.message);
      delete global._testMongoClientPromise;
      return null;
    });
    mongo = await global._testMongoClientPromise;
  }
  if (!mongo) {
    throw new Error("Unable to connect to Aptitude Database");
  }
  return mongo.db("test");
}

export { clientPromise };
