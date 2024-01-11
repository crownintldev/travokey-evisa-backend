const path = require('path');
const fs = require('fs');

exports.googleDriveApi=()=>{
    const filePath = path.join(__dirname, 'example.jpg');

    var fileMetadata = {
      'name': 'example.jpg',
      // Add folder ID if you want to upload to a specific folder
      'parents': ['YOUR_FOLDER_ID']
    };
  
    var media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream(filePath)
    };

    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, (err, file) => {
        if (err) {
          // Handle error
          console.error(err);
          res.status(500).send('File upload failed');
        } else {
          res.status(200).send('File Id: ' + file.data.id);
        }
      });
      
}