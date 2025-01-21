require("dotenv").config();
const axios = require("axios");
const querystring = require("querystring");

// const CLIENT_ID = process.env.BOX_CLIENT_ID;
const CLIENT_ID = "aji1cfqt0qonc8hcig7hvhesl85vrqbk";
// const CLIENT_SECRET = process.env.BOX_CLIENT_SECRET;
const CLIENT_SECRET = "cb05EjUK8AYSUJAmgDotZ2KcGff245if";
const TOKEN_URL = "https://api.box.com/oauth2/token";

async function getToken() {
  try {
    // Format the data for application/x-www-form-urlencoded
    const data = querystring.stringify({
      grant_type: "client_credentials", // Use client credentials grant type
      client_id: CLIENT_ID, // Your Box App Client ID
      client_secret: CLIENT_SECRET, // Your Box App Client Secret
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

    return accessToken;

    // // Refresh token
    // const newData = querystring.stringify({
    //   grant_type: "client_credentials", // Use client credentials grant type
    //   client_id: CLIENT_ID, // Your Box App Client ID
    //   client_secret: CLIENT_SECRET, // Your Box App Client Secret
    //   refresh_token: accessToken,
    // });

    // const newResponse = await axios.post(TOKEN_URL, data, { headers });
    // const refreshToken = newResponse.data.access_token;
    // console.log("Refresh Token:", refreshToken);

    // return refreshToken;
  } catch (error) {
    console.error(
      "Error generating access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to get access token");
  }
}

// Call the function to get the token
getToken();
