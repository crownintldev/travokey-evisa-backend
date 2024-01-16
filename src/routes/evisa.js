
const { google } = require("googleapis");
const express = require('express')
const router = express.Router();

const {create,update,remove,list } = require('../controllers/evisa')

// adminmiddleware and superadminmiddleware required
router.post("/evisa/create", create)
router.get("/evisa", list)
router.put("/evisa/update/:id",update)
router.post("/evisa/remove", remove)


const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

// Generate the authentication URL
const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
    include_granted_scopes: true
  });
  

router.get('/auth/google', (req, res) => {
    res.redirect(authUrl);
  });
  
  // Callback route after authentication
  router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      // Save tokens for later use (e.g., in a database)
      res.send('Authentication successful!');
    } catch (error) {
      console.error('Error authenticating:', error);
      res.status(500).send('Authentication failed.');
    }
  });
  

module.exports = router;