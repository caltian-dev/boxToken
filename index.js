const fs = require("fs");
const http = require("http");
const axios = require("axios");
const querystring = require("querystring");

const CLIENT_ID = "o7xpgssqmi6ztyurh7icr8orqq6asrbt"; // Replace with your client ID
const CLIENT_SECRET = "rf7oeCzxfSeTYhnmYvJ4I27XCfCx0MVp"; // Replace with your client secret
const REFRESH_TOKEN =
  "sbTxJEOCiUUAM3V3QhrCadPCoxwOJeov5GiGIEpnsyNPL98M8PzqNNk1DkNYYHBI";
const TOKEN_URL = "https://api.box.com/oauth2/token";
const hostname = "127.0.0.1";
const port = 3000;
const REFRESH_TOKEN_FILE = "token.txt";

// Function to store a variable value in a .txt file
async function storeValue(filename, value) {
  fs.writeFile(filename, value, "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Value stored successfully.");
    }
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url !== "/") {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }
    // Set the response HTTP header
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    let refresh_token = REFRESH_TOKEN;
    fs.readFile(REFRESH_TOKEN_FILE, "utf8", async (err, token) => {
      if (err) {
        console.error("Error reading file:", err);
      } else {
        console.log("Value retrieved successfully.");
        refresh_token = token || REFRESH_TOKEN;
      }
      // Format the data for application/x-www-form-urlencoded
      console.log("Refresh_token", refresh_token);
      const data = querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      });

      // Set headers including content-type
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded", // Specify Content-Type header
      };

      // Make POST request with formatted data and headers
      const response = await axios.post(TOKEN_URL, data, { headers });

      // Get access token from the response
      const accessToken = response.data.access_token;
      await storeValue(REFRESH_TOKEN_FILE, response.data.refresh_token);
      console.log("Access Token:", response.data);

      // Send the response body
      res.end(accessToken);
    });
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
