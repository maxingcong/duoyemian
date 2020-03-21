import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { message } from 'antd';
import fetch from 'app/util/fetch';
//import { base } from 'app/util/base';
import { actions, FETCH_LIST, BATCH_DELETE, DELETE_RECORD, REST_NAME, FETCH_SUBTYPE, FETCH_TOKEN } from '../actions';

//const baseApi = 'https://tea-ntest.woqufadai.com/netdisk';
let searchParams = {};
let token = '';

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

function* fetchList(action) {
  try {
    searchParams = action.payload;
    yield put(actions.setLoading({loading: true}));
    yield put(actions.setSearchParams(action.payload));
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/list`,
      method: 'get',
      params: action.payload,
      headers: {'token': token}
    });
    if (res) {
      yield put(actions.fetchListSuccess(res));
    } else {
      yield put(actions.setLoading({loading: false}));
      message.error('请求首页数据出错，请刷新页面重试', 5);
    }
  } catch (err) {
    yield put(actions.setLoading({loading: false}));
    message.error(err.message, 5);
  }
}

function* deleteRecord(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/${action.payload}`,
      method: 'DELETE',
      headers: {'token': token}
    });
    if (res) {
      message.success('删除成功',5);
      yield put(actions.fetchList({...searchParams, pageNo: 1}));
    } else {
      message.error('删除失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* batchDelete(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/batch-delete`,
      method: 'post',
      data: action.payload,
      headers: {'token': token}
    });
    if (res) {
      message.success('删除成功',5);
      yield put(actions.fetchList({...searchParams, pageNo: 1}));
    } else {
      message.error('删除失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* restName(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/reset-name`,
      method: 'post',
      data: action.payload,
      headers: {'token': token}
    });
    if (res) {
      message.success('修改名称成功',5);
      yield put(actions.fetchList(searchParams));
    } else {
      message.error('修改名称失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* fetchSubType(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/${action.payload}/sub-type`,
      headers: {'token': token}
    });
    if (res) {
      yield put(actions.fetchSubTypeSuccess(res));
    } else {
      message.error('获取文档子类型出错，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

export default function* rootSaga() {
  yield [
    takeLatest(FETCH_LIST, fetchList),
    takeLatest(BATCH_DELETE, batchDelete),
    takeLatest(DELETE_RECORD, deleteRecord),
    takeLatest(REST_NAME, restName),
    takeLatest(FETCH_SUBTYPE, fetchSubType),
    takeLatest(FETCH_TOKEN, fetchToken)
  ];
}
