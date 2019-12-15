import { all } from "redux-saga/effects";
import { watchInit } from "./initSaga";
export default function* rootSaga() {
  yield all([
    watchInit()
  ])
}
