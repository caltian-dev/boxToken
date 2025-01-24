const http = require("http");
const axios = require("axios");
const querystring = require("querystring");

const CLIENT_ID = "o7xpgssqmi6ztyurh7icr8orqq6asrbt"; // Replace with your client ID
const CLIENT_SECRET = "rf7oeCzxfSeTYhnmYvJ4I27XCfCx0MVp"; // Replace with your client secret
const REFRESH_TOKEN =
  "pY7rS7nqwHKSvQKI4o1zmKhzuOwtZviLg9z3VL58WlbPKEuS8K2PcCiVprkKzeRV";
const TOKEN_URL = "https://api.box.com/oauth2/token";
const hostname = "127.0.0.1";
const port = 3000;

// MongoDB connection details
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoUri =
  "mongodb+srv://daiki:123@cluster0.wfaub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB Atlas connection string
const dbName = "boxtoken"; // Replace with your database name
const collectionName = "tokens"; // Replace with your collection name

// MongoDB client setup
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to retrieve the refresh token from MongoDB
async function getRefreshToken() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const token = await collection.findOne({}, { sort: { _id: -1 } }); // Get the most recent token
    return token ? token.refresh_token : null;
  } finally {
    await client.close();
  }
}

// Function to store the refresh token in MongoDB
async function storeRefreshToken(refreshToken) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne({ refresh_token: refreshToken });
    console.log("Refresh token stored successfully.");
  } finally {
    await client.close();
  }
}

const server = http.createServer(async (req, res) => {
  try {
    // Set the response HTTP header
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    let refreshToken = await getRefreshToken();
    refreshToken = refreshToken || REFRESH_TOKEN; // Fallback if no token in DB

    console.log("Current Refresh Token:", refreshToken);

    const data = querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    // Request a new access token
    const response = await axios.post(TOKEN_URL, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const newRefreshToken = response.data.refresh_token;
    const accessToken = response.data.access_token;

    // Store the new refresh token in MongoDB
    await storeRefreshToken(newRefreshToken);

    console.log("New Refresh Token Stored:", newRefreshToken);

    // Send the response body
    res.end(accessToken);
  } catch (error) {
    console.error(
      "Error generating access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to get access token");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
