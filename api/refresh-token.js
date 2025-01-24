import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";
import querystring from "querystring";

const CLIENT_ID = "o7xpgssqmi6ztyurh7icr8orqq6asrbt"; // Replace with your client ID
const CLIENT_SECRET = "rf7oeCzxfSeTYhnmYvJ4I27XCfCx0MVp"; // Replace with your client secret
const REFRESH_TOKEN =
  "pY7rS7nqwHKSvQKI4o1zmKhzuOwtZviLg9z3VL58WlbPKEuS8K2PcCiVprkKzeRV";
const TOKEN_URL = "https://api.box.com/oauth2/token";

const mongoUri =
  "mongodb+srv://daiki:123@cluster0.wfaub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "boxtoken"; // Database name
const collectionName = "tokens"; // Collection name

let client;

const connectToDatabase = async () => {
  if (client) return client; // Reuse connection if it's already established
  client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const db = (await connectToDatabase()).db(dbName);
    const collection = db.collection(collectionName);

    // Retrieve the latest refresh token from the database
    const token = await collection.findOne({}, { sort: { _id: -1 } });

    let refreshToken = token ? token.refresh_token : REFRESH_TOKEN; // Use the stored token or fallback

    console.log("Current Refresh Token:", refreshToken);

    const data = querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const response = await axios.post(TOKEN_URL, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const newRefreshToken = response.data.refresh_token;
    const accessToken = response.data.access_token;

    // Store the new refresh token in MongoDB
    await collection.insertOne({ refresh_token: newRefreshToken });

    console.log("New Refresh Token Stored:", newRefreshToken);

    // Send the access token as the response
    res.status(200).send(accessToken);
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response?.data || error.message
    );
    res.status(500).send("Error refreshing token.");
  }
}
