import { _ERROR, _SUCCESS } from "./constants";

const initialState = {};

function cajeroReducer(state = initialState, { type, payload }) {
  switch (type) {
    default:
      return state;
  }
}

console.log(_ERROR, _SUCCESS);
export default cajeroReducer;
