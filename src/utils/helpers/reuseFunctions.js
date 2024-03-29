const constants = require("./constants");
const { Response } = require("./responseHandler");

exports.removeUndefined = (data) => {
  for (let key in data) {
    if (
      data[key] === undefined ||
      data[key] === "" ||
      (Array.isArray(data[key]) && data[key].length === 0)
    ) {
      delete data[key];
    }
  }
};

exports.capitalizeFirstLetter = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

exports.isAllSameinArray = (dataArray) => {
  if (dataArray.length === 0) return false; // or true, based on how you want to treat an empty array

  const firstElementName = dataArray[0];
  return dataArray.every((item) => item === firstElementName);
};

// exampleCamelCaseString to 'Example Camel Case String'
exports.capitalizeCamelSpace = (name) => {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return capitalized.replace(/([A-Z])/g, " $1").trim();
};

exports.IsArray = (data, res) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return Response(res, 400, "Not Found Ids");
  }
};

exports.onlyIntegerAllowed = (res, number) => {
  if (number !== undefined && /^\d+$/.test(number)) {
    return (number = Number(number));
  } else {
    return Response(res, 400, "Missing or contains non-numeric characters");
  }
};

exports.extractArrayItems = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value[0]])
  );

// const oneValueAllowed = (value) => {
//   if (value.processing) {
//     return { ...value, confirmed: undefined };
//   } else if (value.confirmed) {
//     return { ...value, processing: undefined };
//   }
//   return value;
// };
