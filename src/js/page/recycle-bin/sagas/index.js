import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { message } from 'antd';
import fetch from 'app/util/fetch';
//import { baseApi } from 'app/util/base';
import { actions, FETCH_LIST, BATCH_DELETE, DELETE_RECORD, REVIVIFICATION, BATCH_REVIVIFICATION, CLEAR_LIST,  FETCH_TOKEN } from '../actions';

let searchParams = {};
let token = '';
//const baseApi = 'https://tea-ntest.woqufadai.com/netdisk';

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
    yield put(actions.setLoading({loading: true}));
    searchParams = { ...searchParams, ...action.payload };
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/list/recycler`,
      method: 'get',
      params: searchParams,
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
      url: `/netdisk/api/net-disk-files/${action.payload}/recycler`,
      method: 'DELETE',
      headers: {'token': token}
    });
    if (res) {
      message.success('删除成功',5);
      yield put(actions.fetchList({...searchParams, pageNo:1}));
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
      url: `/netdisk/api/net-disk-files/batch-delete-by-recycler`,
      method: 'post',
      data: action.payload,
      headers: {'token': token}
    });
    if (res) {
      message.success('删除成功',5);
      yield put(actions.fetchList({...searchParams, pageNo:1}));
    } else {
      message.error('删除失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* revivification(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/${action.payload}/revivification`,
      method: 'PUT',
      headers: {'token': token}
    });
    if (res) {
      message.success('还原成功',5);
      yield put(actions.fetchList({...searchParams, pageNo: 1}));
    } else {
      message.error('还原失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* batchRevivification(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/batch-revivification`,
      method: 'post',
      headers: {'token': token},
      data: action.payload
    });
    if (res) {
      message.success('还原成功',5);
      yield put(actions.fetchList({...searchParams, pageNo: 1}));
    } else {
      message.error('还原失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* clearList(action) {
  try {
    const res = yield call(fetch, {
      url: `/netdisk/api/net-disk-files/clear-recycler`,
      method: 'DELETE',
      headers: {'token': token}
    });
    if (res) {
      message.success('清空成功',5);
      yield put(actions.fetchList({...searchParams, pageNo: 1}));
    } else {
      message.error('清空失败，请重试', 5);
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
    takeLatest(REVIVIFICATION, revivification),
    takeLatest(BATCH_REVIVIFICATION, batchRevivification),
    takeLatest(CLEAR_LIST, clearList),
    takeLatest(FETCH_TOKEN, fetchToken)
  ];
}
