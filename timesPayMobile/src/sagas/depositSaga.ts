import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_START_DEPOSIT,
  FETCH_SUCCESS_DEPOSIT,
  FETCH_FAILED_DEPOSIT,
  SET_ADDRESS_DEPOSIT
} from '../actions/actionTypes';

import {
  fetchStart,
  fetchSuccess,
  fetchFailed
} from '../actions/depositAction';

export function* watchDeposit() {
}
