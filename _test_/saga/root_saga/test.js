const fs = require("fs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;
const { processRootSaga } = require("./SagaProccessRootSaga");

const run = async () => {
  // Procesamos los datos
  processRootSaga(__dirname + "/saga_base.js", "home");
};

run();
