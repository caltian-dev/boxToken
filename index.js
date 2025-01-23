const http = require("http");
const axios = require("axios");
const querystring = require("querystring");

const CLIENT_ID = "o7xpgssqmi6ztyurh7icr8orqq6asrbt"; // Replace with your client ID
const CLIENT_SECRET = "rf7oeCzxfSeTYhnmYvJ4I27XCfCx0MVp"; // Replace with your client secret
const REFRESH_TOKEN =
  "WC3h5vO07TnDlfCVpK0KcdU0KtFpxefwtZYc3wUYs3nSpJR8FdridB1vv3Usmj4m";
const TOKEN_URL = "https://api.box.com/oauth2/token";
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    // Set the response HTTP header
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    // Format the data for application/x-www-form-urlencoded
    const data = querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
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
    console.log("Access Token:", response.data);

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
