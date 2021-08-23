import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { homeReducer } from "../modules/home/handlers/homeReducer";

const rootReducer = (history) => {
  return combineReducers({
    router: connectRouter(history),
    home: homeReducer,
  });
};

export default rootReducer;
