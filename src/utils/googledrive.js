// const { google } = require("googleapis");
// const formidable = require("formidable");
// const fs = require("fs");
// const path = require("path");
// const { Response } = require("./helpers/responseHandler");

// const apikeys = require("../../apikeys.json");
// const SCOPE = ["https://www.googleapis.com/auth/drive"];

// // A Function that can provide access to google drive api

// async function authorize() {
//   const jwtClient = new google.auth.JWT(
//     process.env.CLIENT_EMAIL,
//     null,
//     process.env.PRIVATE_KEY,
//     SCOPE
//   );

//   await jwtClient.authorize();

//   return jwtClient;
// }

// exports.CreateFormidableHandler = async (req, res, model) => {
//   return new Promise((resolve, reject) => {
//     let form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         // Handle form parse error
//         return Response(res, 400, "all fields required");
//       }
//       // Upload files to Google Drive
//       // allowed files is int schema methods check the allowed files
//       if (files.files && files.files.length > 0 && model.allowedFiles) {
//         try {
//           model.allowedFiles(files.files);
//         } catch (error) {
//           // console.error(error.message);
//           return Response(res, 400, error.message);
//         }
//       }
//       try {
//         const authClient = await authorize();
//         let googleDriveResponses = [];
//         if (files.files && files.files.length > 0) {
//           googleDriveResponses = await uploadFilesToGoogleDrive(
//             authClient,
//             files.files
//           );
//         }

//         const extractFirstItems = (data) =>
//           Object.fromEntries(
//             Object.entries(data).map(([key, value]) => [key, value[0]])
//           );
//         const extractedFieldData = extractFirstItems(fields);
//         const data = {
//           ...extractedFieldData,
//           files: googleDriveResponses,
//         };
//         resolve(data);
//       } catch (error) {
//         // console.error(error.message);
//         return Response(res, 400, error.message);
//       }
//     });
//   });
// };

// exports.UpdateFormidableHandler = async (req, res, model) => {
//   return new Promise((resolve, reject) => {
//     let form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         Response(res, 400, "all fields required");
//         return reject();
//       }
//       // Upload files to Google Drive
//       // allowed files is int schema methods check the allowed files
//       if (files.files && files.files.length > 0 && model.allowedFiles) {
//         try {
//           model.allowedFiles(files.files);
//         } catch (error) {
//           // console.error(error.message);
//           return Response(res, 400, error.message);
//         }
//       }

//       try {
//         const authClient = await authorize();
//         let googleDriveResponses = [];
//         if (files.files && files.files.length > 0) {
//           googleDriveResponses = await uploadFilesToGoogleDrive(
//             authClient,
//             files.files
//           );
//         }

//         const extractFirstItems = (data) =>
//           Object.fromEntries(
//             Object.entries(data).map(([key, value]) => [key, value[0]])
//           );
//         const extractedFieldData = extractFirstItems(fields);

//         let deletedFiles;
//         if (
//           extractedFieldData.deletedFiles &&
//           extractedFieldData.deletedFiles.length > 0
//         ) {
//           deletedFiles = JSON.parse(extractedFieldData.deletedFiles);
//           // const deleteFilesResponse = await cloudinaryDeleteFiles(deletedFiles);
//           const deleteFilesResponse = await removeFilesFromGoogleDrive(
//             authClient,
//             deletedFiles
//           );
//           // console.log("deleteFilesResponse",deleteFilesResponse)
//           // if (!deleteFilesResponse) {
//           //   return Response(res, 400, "deleted Files not Found");
//           // }
//           extractedFieldData.deletedFiles = deletedFiles;
//         }

//         const data = {
//           ...extractedFieldData,
//           files: googleDriveResponses,
//         };

//         resolve(data);
//       } catch (error) {
//         return Response(res, 400, error.message);
//       }
//     });
//   });
// };

// const findFolderByName = async (drive, folderName, parentFolderId = null) => {
//   try {
//     let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
//     if (parentFolderId) {
//       query += ` and '${parentFolderId}' in parents`;
//     }
//     query += ` and trashed = false`; // Check that the folder is not in the trash

//     const response = await drive.files.list({
//       q: query,
//       fields: "files(id, name)",
//       spaces: "drive",
//     });

//     const folder =
//       response.data.files.length > 0 ? response.data.files[0] : null;
//     return folder ? folder.id : null;
//   } catch (error) {
//     console.error("Error finding folder:", error);
//     throw error;
//   }
// };

// const createFolder = async (authClient, folderName, parentFolderId) => {
//   const drive = google.drive({ version: "v3", auth: authClient });
//   const fileMetadata = {
//     name: folderName,
//     mimeType: "application/vnd.google-apps.folder",
//     parents: parentFolderId ? [parentFolderId] : [],
//   };

//   try {
//     const folder = await drive.files.create({
//       resource: fileMetadata,
//       fields: "id",
//     });

//     return folder.data.id; // Return the ID of the created folder
//   } catch (error) {
//     console.error("Error creating folder:", error);
//     throw error;
//   }
// };

// const uploadFilesToGoogleDrive = async (authClient, files) => {
//   const googleDriveResponses = [];
//   const drive = google.drive({ version: "v3", auth: authClient });

//   // Create a folder first
//   const foldering = ["members"];
//   let parentFolderId = "1vpzbZpqOK1fD8gmpNglZ_Gso6f1o3U_B"; // Root folder ID

//   for (const folderName of foldering) {
//     let folderId = await findFolderByName(drive, folderName, parentFolderId);
//     if (!folderId) {
//       folderId = await createFolder(authClient, folderName, parentFolderId);
//     }

//     parentFolderId = folderId; // Update parentFolderId for nesting
//   }
//   for (const key of Object.keys(files)) {
//     const file = files[key];

//     if (file.size > 10000000) {
//       throw new Error(`File ${key} should be less than 10MB in size`);
//     }
//     // console.log(file);
//     const fileMetadata = {
//       name: file.originalFilename,
//       parents: [parentFolderId], // Replace with your folder ID
//     };

//     const media = {
//       mimeType: file.mimetype,
//       body: fs.createReadStream(file.filepath),
//     };

//     try {
//       const driveResponse = await drive.files.create({
//         resource: fileMetadata,
//         media: media,
//         fields: "id,name, mimeType, webViewLink",
//       });

//       const fileInfo = {
//         fileId: driveResponse.data.id,
//         fileType: driveResponse.data.mimeType,
//         fileUrl: driveResponse.data.webViewLink,
//         fileName: driveResponse.data.name,
//       };
//       // console.log(fileInfo);

//       googleDriveResponses.push(fileInfo);
//     } catch (error) {
//       console.error("Error uploading to Google Drive:", error);
//       throw error;
//     }
//   }

//   return googleDriveResponses;
// };

// async function removeFilesFromGoogleDrive(authClient, fileIds) {
//   const drive = google.drive({ version: "v3", auth: authClient });

//   for (const fileId of fileIds) {
//     try {
//       await drive.files.delete({
//         fileId: fileId,
//       });
//       console.log(`File with ID: ${fileId} has been deleted.`);
//     } catch (error) {
//       console.error(
//         `Error removing file with ID ${fileId} from Google Drive:`,
//         error
//       );
//       // You may choose to throw the error or just log it, depending on how you want to handle partial failures
//     }
//   }
// }
