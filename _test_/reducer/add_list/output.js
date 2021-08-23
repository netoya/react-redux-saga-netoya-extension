import { _ERROR, _SUCCESS, CAJEROS, BANCOS, ZANAHORIAS } from "./constants";
const initialState = {
  bancos: [],
  bancos_error: {
    message: ""
  },
  bancos_loading: false,
  cajeros: [],
  cajeros_error: {
    message: ""
  },
  cajeros_loading: false,
  zanahorias: [],
  zanahorias_error: {
    message: ""
  },
  zanahorias_loading: false
};

const zanahorias = (state, payload) => {
  state = { ...state
  };
  state.zanahorias_loading = true;
  return { ...state
  };
};

const zanahoriasSuccess = (state, payload) => {
  state = { ...state
  };
  state.zanahorias_loading = false;
  state.zanahorias = [...payload.zanahorias];
  return { ...state
  };
};

const zanahoriasError = (state, payload) => {
  const {
    error = {
      message: ""
    }
  } = payload;
  state = { ...state
  };
  state.zanahorias_loading = false;
  state.zanahorias_error = { ...error
  };
  return { ...state
  };
};

const bancos = (state, payload) => {
  state = { ...state
  };
  state.bancos_loading = true;
  return { ...state
  };
};

const bancosSuccess = (state, payload) => {
  state = { ...state
  };
  state.bancos_loading = false;
  state.bancos = [...payload.bancos];
  return { ...state
  };
};

const bancosError = (state, payload) => {
  const {
    error = {
      message: ""
    }
  } = payload;
  state = { ...state
  };
  state.bancos_loading = false;
  state.bancos_error = { ...error
  };
  return { ...state
  };
};

const cajeros = (state, payload) => {
  state = { ...state
  };
  state.cajeros_loading = true;
  return { ...state
  };
};

const cajerosSuccess = (state, payload) => {
  state = { ...state
  };
  state.cajeros_loading = false;
  state.cajeros = [...payload.cajeros];
  return { ...state
  };
};

const cajerosError = (state, payload) => {
  const {
    error = {
      message: ""
    }
  } = payload;
  state = { ...state
  };
  state.cajeros_loading = false;
  state.cajeros_error = { ...error
  };
  return { ...state
  };
};

function cajeroReducer(state = initialState, {
  type,
  payload
}) {
  switch (type) {
    case ZANAHORIAS:
      return zanahorias(state, payload);

    case ZANAHORIAS + _SUCCESS:
      return zanahoriasSuccess(state, payload);

    case ZANAHORIAS + _ERROR:
      return zanahoriasError(state, payload);

    case BANCOS:
      return bancos(state, payload);

    case BANCOS + _SUCCESS:
      return bancosSuccess(state, payload);

    case BANCOS + _ERROR:
      return bancosError(state, payload);

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

console.log(_ERROR, _SUCCESS);
export default cajeroReducer;