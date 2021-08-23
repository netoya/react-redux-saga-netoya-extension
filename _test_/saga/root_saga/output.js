import { all } from "redux-saga/effects";
import homeSaga from '../modules/home/handlers/homeSaga';
import contactoSaga from "../modules/contacto/handlers/contactoSaga";

function* rootSaga() {
  yield all([contactoSaga(), homeSaga()]);
}

export default rootSaga;