//@ts-check
const EVisaCategory = require("../../models/evisaId/evisa-category");
const { Response } = require("../../utils/helpers/responseHandler");
const {
  removeMany,
  createApi,
  updateApi,
  createAggregationPipeline,
  listCommonAggregationFilterize
} = require("../../utils/common/controllerFunction");
const { handleAsync } = require("../../utils/helpers/handleAsync");


let model = EVisaCategory;
let modelName = model.modelName;

exports.create = handleAsync(async (req, res) => {
  const { name } = req.body;
  const response = await createApi(model, { name });
  // console.log(response);
  Response(res, 200, "Category Create Successfully", [response], 1);
}, modelName);

exports.update = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const response = await updateApi(model, id, { name });
  // console.log(response);
  return Response(res, 200, "ok", [response]);
}, modelName);

exports.remove = async (req, res) => {
  removeMany(req, res, model);
};
exports.list = (req, res) => {
  listCommonAggregationFilterize(req, res, model, createAggregationPipeline,customParams);
};

// for list aggregation pipeline
const customParams = {
  projectionFields: {
    _id:1,
    name: 1,
    createdAt: 1,
    updatedAt: 1,
  },
  searchTerms: [
    "name",
    "createdAt",
    "updatedAt",
  ],
};
