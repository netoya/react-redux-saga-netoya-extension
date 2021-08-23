import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { homeReducer } from '../modules/home/handlers/homeReducer';

const rootReducer = history => {
  return combineReducers({
    home: homeReducer,
    router: connectRouter(history)
  });
};

export default rootReducer;