const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data"); // To handle multipart/form-data

const ACCESS_TOKEN = "iHkjnbRaQ77m1rS1HCUSUQ79CWcT17Rw"; // Use the token obtained from OAuth
const FOLDER_ID = "0"; // '0' is the root folder. You can replace it with another folder ID
const FILE_PATH = "C:/1.txt"; // Full path to the file on C: drive

async function uploadFile() {
  // Read the file into a stream
  const fileStream = fs.createReadStream(FILE_PATH);

  // Create a FormData instance and append the file
  const form = new FormData();
  form.append("file", fileStream);
  form.append("parent_id", FOLDER_ID); // Folder ID where the file will be uploaded

  try {
    // Make the API request to upload the file
    const response = await axios.post(
      "https://upload.box.com/api/2.0/files/content",
      form,
      {
        headers: {
          ...form.getHeaders(), // Include headers for multipart/form-data
          Authorization: `Bearer ${ACCESS_TOKEN}`, // Include the access token for authentication
        },
      }
    );

    // Handle the successful response
    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    console.error(
      "Error uploading file:",
      error.response ? error.response.data : error.message
    );
  }
}

uploadFile();
