const esquery = require("esquery");
const _ = require("lodash");

exports.processGet = async (data) => {
  const matches = esquery(data.ast, data.query);
  if (!data.path) return matches;
  return _.get(matches, data.path);
};
