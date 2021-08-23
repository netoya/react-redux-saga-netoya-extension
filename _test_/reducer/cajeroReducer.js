import {
  _SUCCESS,
  _ERROR,
  CAJEROS,
  CAJERO_CAJA_FORM_MODAL,
  CAJERO_CAJA_DELETE_MODAL,
  CAJEROS_CAJA,
  CAJEROS_CAJA_SELECTED,
  CAJERO_CAJA_ADD,
  CAJERO_CAJA_DELETE
} from "./constants";
import { LOGIN } from "../Login/constants";
import { EMPRESA } from "../Empresa/constants";
import { TURNO_DRAWER, TURNOS_SELECTED } from "../Turno/constants";

const initialState = {
  cajeros: [],
  cajeros_caja: [],
  cajeros_caja_selected: {},
  cajero_caja_form_modal: {
    open: false
  },
  cajero_caja_delete_modal: {
    open: false
  }
};

function cajeroReducer(state = initialState, action) {
  switch (action.type) {
    case CAJEROS:
      console.log("Loading cajeros");
      return state;
    case CAJEROS + _SUCCESS:
      console.log("Loaded cajeros");
      state = Object.assign({}, state);
      state.cajeros = action.payload.cajeros;
      return state;
    case CAJEROS + _ERROR:
      console.log({ action });
      console.log("Error cajeros");
      return state;

    case CAJEROS_CAJA:
      console.log("Loading cajeros");
      return state;
    case CAJEROS_CAJA + _SUCCESS:
      console.log("Loaded cajeros");
      state = Object.assign({}, state);
      state.cajeros_caja = action.payload.cajeros_caja;
      return state;
    case CAJEROS_CAJA + _ERROR:
      console.log({ action });
      console.log("Error cajeros");
      return state;

    // CAJEROS_CAJA_SELECTED
    case CAJEROS_CAJA_SELECTED:
      console.log("Loaded cajero selected");
      state = Object.assign({}, state);
      state.cajeros_caja_selected = action.payload.cajero;
      return state;

    case CAJERO_CAJA_FORM_MODAL:
      state = Object.assign({}, state);
      state.cajero_caja_form_modal = {
        ...state.cajero_caja_form_modal,
        ...action.payload
      };
      return state;

    case CAJERO_CAJA_ADD + _SUCCESS:
    case CAJERO_CAJA_DELETE + _SUCCESS:
      state = Object.assign({}, state);
      state.cajeros_caja_selected = {};
      return state;

    case CAJERO_CAJA_DELETE_MODAL:
      state = Object.assign({}, state);
      state.cajero_caja_delete_modal = {
        ...state.cajero_caja_delete_modal,
        ...action.payload
      };

      console.log({ state });
      return state;

    // EXTERNAL EVENTS
    case LOGIN:
    case EMPRESA:
      state = Object.assign({}, initialState);
      return state;

    // EXTERNAL EVENTS
    case TURNO_DRAWER:
    case TURNOS_SELECTED:
      state = Object.assign({}, state);
      state.cajeros_caja_selected = {};
      state.cajeros_caja = [];
      return state;

    default:
      return state;
  }
}

export default cajeroReducer;
