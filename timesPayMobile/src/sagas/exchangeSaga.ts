import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_START_EXCHANGE,
  FETCH_SUCCESS_EXCHANGE,
  FETCH_FAILED_EXCHANGE
} from '../actions/actionTypes';

import {
  fetchStart,
  fetchSuccess,
  fetchFailed
} from '../actions/exchangeAction';

export function* watchExchange() {
}
