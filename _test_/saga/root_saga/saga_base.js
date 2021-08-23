import { all } from "redux-saga/effects";
import contactoSaga from "../modules/contacto/handlers/contactoSaga";

function* rootSaga() {
  yield all([contactoSaga()]);
}

export default rootSaga;
