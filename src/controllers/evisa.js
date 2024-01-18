// @ts-check
const EVisa = require("../models/evisa");
const { Response } = require("../utils/helpers/responseHandler");
const { handleAsync } = require("../utils/helpers/handleAsync");
const formidable = require("formidable");
const {
  removeUndefined,
  extractArrayItems,
  onlyIntegerAllowed,
} = require("../utils/helpers/reuseFunctions");
const {
  removeMany,
  createApi,
  CreateHandleFilesGoogleDrive,
  UpdateFilesHandleGoogleDrive,
  listCommonAggregationFilterize,
  createAggregationPipeline,
  lookupUnwindStage,
  BulkWriteForFile,
  aggregationByIds,
} = require("../utils/common/controllerFunction");

let model = EVisa;
let modelName = model.modelName;

exports.create = handleAsync(async (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return Response(res, 400, "all fields required");
    }
    const extractData = extractArrayItems(fields);
    req.files = files?.files;
    extractData.foldering = ["evisa"];
    let { destination, category, type, duration } = extractData;

    const checkAlreadyinDb = await model.findOne({
      $and: [{ destination }, { category }, { type }, { duration }],
    });

    if (checkAlreadyinDb) {
      return Response(
        res,
        400,
        "destination,category,type,duration already used"
      );
    }

    const data = await CreateHandleFilesGoogleDrive(
      req,
      res,
      model,
      extractData
    );
    const { visaFee, serviceCharges, selection } = data;
    if (visaFee) {
      data.visaFee = onlyIntegerAllowed(res, visaFee);
    }
    if (serviceCharges) {
      data.serviceCharges = onlyIntegerAllowed(res, serviceCharges);
    }
    if (selection) {
      data.selection = JSON.parse(selection);
    }
    removeUndefined(data);
    //  console.log(data);
    const evisa = await createApi(model, data);
    //  @ts-ignore
    const response = await aggregationByIds({
      model,
      data: evisa._id,
      customParams,
    });
    return Response(res, 200, `${modelName} Create Successfully`, response);
  });
}, modelName);

exports.update = handleAsync(async (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return Response(res, 400, "all fields required");
    }
    const extractData = extractArrayItems(fields);
    req.files = files?.files;
    extractData.foldering = ["evisa"];
    const data = await UpdateFilesHandleGoogleDrive(
      req,
      res,
      model,
      extractData
    );
    removeUndefined(data);
    const { deletedFiles, ...restOfData } = data;
    let updateData = restOfData;
    const id = req.params.id;
    const bulkResponse = await BulkWriteForFile({
      id,
      data: updateData,
      files: data?.files,
      //fileId is the key this is main field of files, use for deleting
      fileId: "fileId",
      deletedFiles,
      model,
    });
    // console.log(bulkResponse);

    const updatedDocument = await model.findById(id);
 
    if (!updatedDocument) {
      return Response(res, 400, "Id Not Found");
    }
    // @ts-ignore
    const pipeline = createAggregationPipeline({
      ids: [updatedDocument],
      customParams,
    });
    // @ts-ignore
    const aggregateResult = await model.aggregate(pipeline);
    const response = aggregateResult.length > 0 ? aggregateResult[0].data : [];
    return Response(res, 200, "ok", response);
  });
}, modelName);

exports.remove = async (req, res) => {
  removeMany(req, res, model);
};

exports.list = async (req, res) => {
  listCommonAggregationFilterize(
    req,
    res,
    model,
    createAggregationPipeline,
    customParams
  );
};

const lookup = [
  lookupUnwindStage("evisacategories", "category", "_id", "category"),
  lookupUnwindStage("evisatypes", "type", "_id", "type"),
  lookupUnwindStage("evisadestinations", "destination", "_id", "destination"),
  lookupUnwindStage("evisadurations", "duration", "_id", "duration"),
];
const customParams = {
  lookup,
  projectionFields: {
    _id: 1,
    title: 1,
    category: "$category.name",
    type: "$type.name",
    destination: "$destination.name",
    duration: "$duration.name",
    description: 1,
    visaFee: 1,
    serviceCharges:1,
    selection:1,
    files: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  searchTerms: [
    "title",
    "type.name",
    "cnic",
    "category.name",
    "description",
    "createdAt",
    "updatedAt",
  ],
};
