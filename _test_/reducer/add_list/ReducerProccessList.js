const ASTQ = require("astq");
const { upperCase, snakeCase, camelCase } = require("text-case");
const {
  parseImport,
  parseObject,
  parseNode,
  parseNodes,
} = require("../../parseFunctions");

const processConstants = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
      // ImportDeclaration [
        /:source StringLiteral [
            @value == './constants'
        ]
      ]`
  );

  // Buscamos en el array agregar este codigo
  const newImport = parseImport(
    "import {" + upperCase(name) + "} from './constants'"
  );

  let specifiers = result[0].specifiers;

  Object.assign(specifiers, [...specifiers, ...newImport.specifiers]);
};

const processInitialState = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
        // VariableDeclarator [
          /:id Identifier [
              @name == 'initialState'
          ]
          && /:init ObjectExpression
        ]`
  );

  const newObject = parseObject(`{
      ${snakeCase(name)}: [],
      ${snakeCase(name)}_loading: false,
      ${snakeCase(name)}_error: {
        message: "",
      },
    }`);

  let properties = result[0].init.properties;

  properties.splice(0, 0, ...newObject.properties);
  properties.sort((a, b) => a.key.name.localeCompare(b.key.name));
};

const processFunctions = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let reducer_idx = -1;
  ast.program.body.find((elem, idx) => {
    // console.log(elem);
    if (
      elem.declarations &&
      elem.declarations[0]?.type === "VariableDeclarator" &&
      elem.declarations[0]?.id.name === "initialState"
    ) {
      reducer_idx = idx;
    }
  });

  let newNodes = parseNodes(`const ${camelCase(name)} = (state, payload) => {
      state = { ...state };
      state.${snakeCase(name)}_loading = true;
      return { ...state };
    }
    const ${camelCase(name)}Success = (state, payload) => {
      state = { ...state };
      state.${snakeCase(name)}_loading = false;
      state.${snakeCase(name)} = [...payload.${snakeCase(name)}];
      return { ...state };
    };
    const ${camelCase(name)}Error = (state, payload) => {
      const { error = { message: "" } } = payload;
      state = { ...state };
      state.${snakeCase(name)}_loading = false;
      state.${snakeCase(name)}_error = { ...error };
      return { ...state };
    };`);

  // console.log(reducer_idx);
  ast.program.body.splice(reducer_idx + 1, 0, ...newNodes);
};

const processSwitch = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
        // SwitchStatement [
          /:discriminant Identifier [
              @name == 'type'
          ]
        ]`
  );

  let newFunction = parseNode(`function hola (action){
           switch (action) {
      case ${upperCase(name)}:
        return ${camelCase(name)}(state, payload);
        
      case ${upperCase(name)} + _SUCCESS:
        return ${camelCase(name)}Success(state, payload);
  
      case ${upperCase(name)} + _ERROR:
        return ${camelCase(name)}Error(state, payload);
    }
  }`);

  let newSwitch = newFunction.body.body[0];

  let cases = result[0].cases;

  cases.splice(0, 0, ...newSwitch.cases);
  //   );
};

const processList = (ast, name) => {
  processConstants(ast, name);
  processInitialState(ast, name);
  processFunctions(ast, name);
  processSwitch(ast, name);
};

exports.processList = processList;
