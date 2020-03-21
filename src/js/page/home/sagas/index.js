import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { message } from 'antd';
import fetch from 'app/util/fetch';
// import { base } from 'app/util/base';
import { actions, FETCH_UUID, FETCH_STATUS, FETCH_TOKEN } from '../actions';

function* fetchUuid(action) {
  try {
    const uuid = yield call(fetch, {
      url: `/api/login/uuid?t=${Date.now()}`,
    });
    if (uuid) {
      yield put(actions.fetchUuidSuccess(uuid));
    } else {
      message.error('获取唯一标识失败', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* fetchStatus(action) {
  try {
    const res = yield call(fetch, {
      url: `/api/login/qrcode/login/status/${action.payload}?t=${Date.now()}`,
    });
    if (res) {
      if (res.key == 1004) {
        yield put(actions.fetchToken(res));
      }
      yield put(actions.fetchStatusSuccess(res));
    } else {
      message.error('获取登录状态', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* fetchToken(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/token/refresh`,
    });
    if (res) {
      
    } else {
      console.log('获取token失败， 请刷新重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

export default function* rootSaga() {
  yield [
    takeLatest(FETCH_UUID, fetchUuid),
    takeLatest(FETCH_STATUS, fetchStatus),
    takeLatest(FETCH_TOKEN, fetchToken)
  ];
}
