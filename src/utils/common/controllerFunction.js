const { removeMany } = require("../common/controller/remove");
const { createApi } = require("../common/controller/create");
const {
  updateApi,
  softRemoveShowStatus,
  updateManyRecords,
} = require("../common/controller/update");
const {
  listCommonAggregationFilterize,
  aggregationByIds,
} = require("../common/controller/list");
const { BulkWriteForFile } = require("../common/controller/bulkWrite");
const {
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles,
} = require("../common/controller/cloudinary");
const {
  CreateFormidableHandler,
  UpdateFormidableHandler,
} = require("./controller/formidable");
const {
  CreateHandleFilesGoogleDrive,
  UpdateFilesHandleGoogleDrive,
} = require("./controller/googleDrive/main");
const {
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage,
} = require("../common/controller/aggregation");

module.exports = {
  removeMany,
  createApi,
  updateApi,
  updateManyRecords,
  softRemoveShowStatus,
  listCommonAggregationFilterize,
  aggregationByIds,
  BulkWriteForFile,
  //cloudinary
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles,
  CreateFormidableHandler,
  UpdateFormidableHandler,
  //googledrive
  CreateHandleFilesGoogleDrive,
  UpdateFilesHandleGoogleDrive,
  //aggregation
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage,
};
