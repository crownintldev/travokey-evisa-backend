// @ts-check
const EVisa = require("../models/evisa");
const { Response } = require("../utils/helpers/responseHandler");
const { handleAsync } = require("../utils/helpers/handleAsync");
const {removeUndefined}=require("../utils/helpers/reuseFunctions")
const {
  removeMany,
  createApi,
  CreateFormidableHandler,
  UpdateFormidableHandler,
  listCommonAggregationFilterize,
  createAggregationPipeline,
  lookupUnwindStage,
  BulkWriteForFile,
} = require("../utils/common/controllerFunction");

let model = EVisa;
let modelName = model.modelName;

exports.create = handleAsync(async (req, res) => {
  const data = await CreateFormidableHandler(req, res);
//   if (data.price) {
//     data.price = Number(data.price);
//   }
  // console.log(data)
  const response = await createApi(model, data);
  return Response(res, 200, `${modelName} Create Successfully`, [response], 1);
}, modelName);

exports.update = handleAsync(async (req, res) => {
  const data = await UpdateFormidableHandler(req, res);
  const { deletedFiles, files } = data;
  removeUndefined(data)
  console.log(data)
//   if (price) {
//     data.price = Number(price);
//   }

  const id = req.params.id;
  const bulkResponse = await BulkWriteForFile({
    id,
    data,
    files,
    deletedFiles,
    model,
  });
  console.log(bulkResponse);

  const updatedDocument = await model.findById(id);
  if (!updatedDocument) {
    return Response(res, 400, "Id Not Found");
  }
  // @ts-ignore
  const pipeline = createAggregationPipeline({ ids: [updatedDocument],customParams});
  // @ts-ignore
  const aggregateResult = await model.aggregate(pipeline);
  const response = aggregateResult.length > 0 ? aggregateResult[0].data : [];
  return Response(res, 200, "ok", response);
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
  lookupUnwindStage("expensecategories", "category", "_id", "category"),
  lookupUnwindStage("expensetypes", "type", "_id", "type"),
];
const customParams = {
  lookup,
  projectionFields: {
    _id: 1,
    title: 1,
    category: "$category.name",
    type: "$type.name",
    description: 1,
    price: 1,
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

