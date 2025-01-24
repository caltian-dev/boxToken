const fs = require("fs");
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

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./tokens.db");

// Create a table for storing the refresh token
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    refresh_token TEXT NOT NULL
  )`);
});

// Function to retrieve the refresh token from the database
function getRefreshToken(callback) {
  db.get(
    "SELECT refresh_token FROM tokens ORDER BY id DESC LIMIT 1",
    (err, row) => {
      if (err) {
        console.error("Error retrieving token:", err);
        callback(err, null);
      } else {
        callback(null, row ? row.refresh_token : null);
      }
    }
  );
}

// Function to update or insert a new refresh token
function storeRefreshToken(refreshToken, callback) {
  db.run(
    "INSERT INTO tokens (refresh_token) VALUES (?)",
    [refreshToken],
    (err) => {
      if (err) {
        console.error("Error storing token:", err);
        callback(err);
      } else {
        console.log("Refresh token stored successfully.");
        callback(null);
      }
    }
  );
}

const server = http.createServer((req, res) => {
  if (req.url !== "/") {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");

  getRefreshToken(async (err, refreshToken) => {
    if (err) {
      res.end("Error retrieving token.");
      return;
    }

    refreshToken = refreshToken || REFRESH_TOKEN; // Fallback if no token in DB
    console.log("Current Refresh Token:", refreshToken);

    const data = querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    try {
      const response = await axios.post(TOKEN_URL, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const newRefreshToken = response.data.refresh_token;
      const accessToken = response.data.access_token;

      // Store the new refresh token in the database
      storeRefreshToken(newRefreshToken, (storeErr) => {
        if (storeErr) {
          console.error("Error storing new refresh token.");
        } else {
          console.log("New Refresh Token Stored:", newRefreshToken);
        }
      });

      // Send the access token as the response
      res.end(accessToken);
    } catch (error) {
      console.error(
        "Error refreshing token:",
        error.response?.data || error.message
      );
      res.end("Error refreshing token.");
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
