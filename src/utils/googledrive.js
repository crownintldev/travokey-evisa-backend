const { google } = require('googleapis');

// const oAuth2Client = new google.auth.OAuth2(
//   YOUR_CLIENT_ID,
//   YOUR_CLIENT_SECRET,
//   YOUR_REDIRECT_URI
// );

// // Set your access token here
// oAuth2Client.setCredentials({ access_token: YOUR_ACCESS_TOKEN });

// const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// module.exports = { drive };


const { drive } = require('./another');

exports.CreateFormidableHandler = async (req, res, model) => {
  return new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        // Handle form parse error
        Response(res, 400, "all fields required");
      }
      // Upload files to Google Drive
      try {
        const googleDriveResponses = await uploadFilesToGoogleDrive(files);
        const extractFirstItems = (data) =>
          Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value[0]])
          );
        const extractedFieldData = extractFirstItems(fields);
        const data = {
          ...extractedFieldData,
          files: googleDriveResponses,
        };
        resolve(data);
      } catch (error) {
        console.error(error.message);
        return Response(res, 400, error.message);
      }
    });
  });
};

async function uploadFilesToGoogleDrive(files) {
  const googleDriveResponses = [];
  const fileKeys = Object.keys(files);

  for (const key of fileKeys) {
    const file = files[key];

    // Check file size (example: less than 10MB)
    if (file.size > 10000000) {
      throw new Error(`File ${key} should be less than 10MB in size`);
    }

    // Upload the file to Google Drive
    const fileMetadata = {
      'name': file.name,
      'parents': ['YOUR_FOLDER_ID'], // Replace with your Google Drive folder ID
    };

    const media = {
      mimeType: file.type,
      body: fs.createReadStream(file.path),
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    googleDriveResponses.push({
      fileId: driveResponse.data.id,
      fileName: file.name,
    });
  }

  return googleDriveResponses;
}
