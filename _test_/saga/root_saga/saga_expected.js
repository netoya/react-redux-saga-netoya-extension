import { all } from "redux-saga/effects";
import homeSaga from "../modules/home/handlers/homeSaga";

function* rootSaga() {
  yield all([homeSaga()]);
}

export default rootSaga;
