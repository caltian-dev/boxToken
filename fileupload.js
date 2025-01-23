const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const querystring = require("querystring");

const TOKEN_URL = "https://api.box.com/oauth2/token";
const UPLOAD_URL = "https://upload.box.com/api/2.0/files/content";
const CLIENT_ID = "o7xpgssqmi6ztyurh7icr8orqq6asrbt"; // Replace with your client ID
const CLIENT_SECRET = "rf7oeCzxfSeTYhnmYvJ4I27XCfCx0MVp"; // Replace with your client secret
const REFRESH_TOKEN =
  "WC3h5vO07TnDlfCVpK0KcdU0KtFpxefwtZYc3wUYs3nSpJR8FdridB1vv3Usmj4m";
const FILE_PATH = "C:/2.txt";
const FOLDER_ID = "0";

async function uploadFile() {
  try {
    // Step 1: Fetch Access Token
    const tokenData = querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const tokenResponse = await axios.post(TOKEN_URL, tokenData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token:", accessToken);

    // Step 2: Upload File
    const fileStream = fs.createReadStream(FILE_PATH);
    const form = new FormData();
    form.append("file", fileStream);
    form.append("parent_id", FOLDER_ID);

    const response = await axios.post(UPLOAD_URL, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
}

uploadFile();
