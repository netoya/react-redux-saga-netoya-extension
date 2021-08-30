exports.parseFile = (file) => ({
  type: "parseFile",
  payload: {
    filename: file,
  },
});

exports.saveFile = (file, ast) => ({
  type: "saveFile",
  payload: {
    filename: file,
    ast,
  },
});

exports.add = (ast, target_query, path, elements, position = 0) => ({
  type: "add",
  payload: {
    ast,
    query: target_query,
    path,
    elements,
    position,
  },
});

exports.remove = (ast, target_query, path) => ({});

exports.get = (ast, target_query, path) => ({
  type: "get",
  payload: {
    ast,
    query: target_query,
    path,
  },
});

exports.set = (ast, target_query, path, value) => ({});
