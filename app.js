//MongoClient.connect() establishes the connection.
//client.close() ensures cleanup even if an error occurs.
//process.on('unhandledRejection') is a safety net to catch unexpected promise rejections.

// Import the MongoClient class from the mongodb package
const { MongoClient } = require("mongodb");

// Import the MongoDB connection URI from a separate file
const uri = require("./atlas_uri");

// Create a new MongoClient instance using the URI
const client = new MongoClient(uri);

// Define the name of the database to use
const dbname = "bank";
const collection_name = "accounts"; // Define the collection name

// Sample account documents to insert into the collection
const sampleAccounts = [
  {
    account_id: "MDB011235813",
    account_holder: "Ada Lovelace",
    account_type: "checking",
    balance: 60218,
  },
  {
    account_id: "MDB829000001",
    account_holder: "Muhammad ibn Musa al-Khwarizmi",
    account_type: "savings",
    balance: 267914296,
  },
];

// Asynchronous function to connect to the MongoDB database
const connectToDatabase = async () => {
  try {
    // Attempt to connect to MongoDB
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // Select the database by name
    const db = client.db(dbname);

    // Return the connected database object
    return db;
  } catch (error) {
    // Log an error message if connection fails
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

// Main function to run the connection and insert logic
const main = async () => {
  try {
    // Call the function to connect to the database
    const db = await connectToDatabase();

    // Get the collection reference
    const accountsCollection = db.collection(collection_name);

    // Insert multiple documents into the collection
    const result = await accountsCollection.insertMany(sampleAccounts);
    console.log(`✅ Inserted ${result.insertedCount} documents`);
    console.log(result);
  } catch (err) {
    // Catch any errors that occur during insertion
    console.error(`❌ Error inserting documents: ${err}`);
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
};

// Run the main function
main();

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', err => {
  console.error('❗Unhandled rejection:', err);
  // Close the MongoDB client if an unhandled rejection occurs
  client.close();
});
