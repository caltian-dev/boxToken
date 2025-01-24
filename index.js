// const fs = require("fs");
// const http = require("http");
// const axios = require("axios");
// const querystring = require("querystring");

// const CLIENT_ID = "o7xpgssqmi6ztyurh7icr8orqq6asrbt"; // Replace with your client ID
// const CLIENT_SECRET = "rf7oeCzxfSeTYhnmYvJ4I27XCfCx0MVp"; // Replace with your client secret
// const REFRESH_TOKEN =
//   "pY7rS7nqwHKSvQKI4o1zmKhzuOwtZviLg9z3VL58WlbPKEuS8K2PcCiVprkKzeRV";
// const TOKEN_URL = "https://api.box.com/oauth2/token";
// const hostname = "127.0.0.1";
// const port = 3000;

// // MongoDB connection details
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const mongoUri =
//   "mongodb+srv://daiki:123@cluster0.wfaub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB Atlas connection string
// const dbName = "boxtoken"; // Replace with your database name
// const collectionName = "tokens"; // Replace with your collection name

// // MongoDB client setup
// const client = new MongoClient(mongoUri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // Function to retrieve the refresh token from MongoDB
// async function getRefreshToken(callback) {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     const token = await collection.findOne({}, { sort: { _id: -1 } }); // Get the most recent token
//     callback(null, token ? token.refresh_token : null);
//   } catch (err) {
//     console.error("Error retrieving token from MongoDB:", err);
//     callback(err, null);
//   }
// }

// // Function to store the refresh token in MongoDB
// async function storeRefreshToken(refreshToken, callback) {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     await collection.insertOne({ refresh_token: refreshToken });
//     console.log("Refresh token stored successfully.");
//     callback(null);
//   } catch (err) {
//     console.error("Error storing token in MongoDB:", err);
//     callback(err);
//   }
// }

// const server = http.createServer((req, res) => {
//   if (req.url !== "/") {
//     res.statusCode = 404;
//     res.end("Not Found");
//     return;
//   }

//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");

//   getRefreshToken(async (err, refreshToken) => {
//     if (err) {
//       res.end("Error retrieving token.");
//       return;
//     }

//     refreshToken = refreshToken || REFRESH_TOKEN; // Fallback if no token in DB
//     console.log("Current Refresh Token:", refreshToken);

//     const data = querystring.stringify({
//       grant_type: "refresh_token",
//       refresh_token: refreshToken,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//     });

//     try {
//       const response = await axios.post(TOKEN_URL, data, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       });

//       const newRefreshToken = response.data.refresh_token;
//       const accessToken = response.data.access_token;

//       // Store the new refresh token in MongoDB
//       storeRefreshToken(newRefreshToken, (storeErr) => {
//         if (storeErr) {
//           console.error("Error storing new refresh token.");
//         } else {
//           console.log("New Refresh Token Stored:", newRefreshToken);
//         }
//       });

//       // Send the access token as the response
//       res.end(accessToken);
//     } catch (error) {
//       console.error(
//         "Error refreshing token:",
//         error.response?.data || error.message
//       );
//       res.end("Error refreshing token.");
//     }
//   });
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
