import { CAJEROS, _ERROR, _SUCCESS } from "./constants";

const initialState = {
  cajeros: [],
  cajeros_loading: false,
  cajeros_error: {
    message: "",
  },
};

const cajeros = (state, payload) => {
  state = { ...state };
  state.cajeros_loading = true;
  return { ...state };
};

const cajerosSuccess = (state, payload) => {
  state = { ...state };
  state.cajeros_loading = false;
  state.cajeros = [...payload.cajeros];
  return { ...state };
};

const cajerosError = (state, payload) => {
  const { cajeros_error = { message: "" } } = payload;
  state = { ...state };
  state.cajeros_loading = false;
  state.cajeros_error = { ...cajeros_error };
  return { ...state };
};

function cajeroReducer(state = initialState, action) {
  switch (action.type) {
    case CAJEROS:
      return cajeros(state, payload);

    case CAJEROS + _SUCCESS:
      return cajerosSuccess(state, payload);

    case CAJEROS + _ERROR:
      return cajerosError(state, payload);

    default:
      return state;
  }
}

export default cajeroReducer;
