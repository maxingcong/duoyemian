import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { message } from 'antd';
import fetch from 'app/util/fetch';
//import axios from 'axios';
import { base } from 'app/util/base';
import { actions, FETCH_ClASS, FETCH_WORK, FETCH_STUDENTS, FETCH_WORK_DETAILS, 
  KIKE_OPT, REWARD_FLOWERS, WITHDRAW_COMMENT, ADD_COMMENT, FETCH_WAIT_STUDENTS, WITHDRAW_ALL, BATCH_KIKE_OPT,
  BATCH_REWARD_FLOWERS, BATCH_ADD_COMMENT
} from '../actions';

//const fetch = data => axios(data).then(res => res.data);
let currentAccId = '';
let currentRecordId = '';
let workId = '';
let classCode = '';

function* fetchClass(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/clazzs `,
    });
    if (res) {
      yield put(actions.fetchClassSuccess(res));
      if (res[0] && res[0].code) {
        classCode = res[0].code;
        yield put(actions.fetchWork(res[0].code));
      } else {
        // 清空
        yield put(actions.fetchWorkSuccess({}));
      }
    } else {
      message.error('没有班级数据', 5);
      yield put(actions.setLoading({loading: false}));
    }
  } catch (err) {
    yield put(actions.setLoading({loading: false}));
    message.error(err.message, 5);
  }
}

function* fetchWork(action) {
  try {
    if (action.payload) {
      classCode = action.payload;
    } else {
      action.payload = classCode;
    }
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/clazz/${action.payload}/works?orderByTime=1`,
    });
    if (res) {
      yield put(actions.fetchWorkSuccess(res) || []);
      // 如果有作业则去拿去学生列表
      if (res && res[0] && res[0].id) {
        yield put(actions.fetchStudents(res[0].id));
      } else {
         // 清空
        yield put(actions.fetchStudentsSuccess({studentsList: {}, workDetails: {}}));
        workId = ''
      }
    } else {
      yield put(actions.fetchStudentsSuccess({studentsList: {}, workDetails: {}}));
      message.error('请求作业出错，请刷新页面重试', 5);
    }
  } catch (err) {
    yield put(actions.fetchStudentsSuccess({studentsList: {}, workDetails: {}}));
    message.error(err.message, 5);
  }
}

function* fetchStudents(action) {
  try {
    if (action.payload) {
      workId = action.payload;
    } else {
      action.payload = workId;
    }
    if (!action.payload) {
      message.error('你还未选中作业', 5);
      yield put(actions.setLoading({studentsListLoading: false}));
      return false;
    }  
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/${action.payload}/student`,
    });
    if (res) {
      currentRecordId = res.wait && res.wait[0] ? res.wait[0].recordId : ''
      yield put(actions.fetchStudentsSuccess({
        studentsList: res,
        currentRecordId,
        currentWorkId: action.payload
      }));
      if (res.wait && res.wait[0] && res.wait[0].accId && res.wait[0].recordId){
        yield put(actions.fetchWorkDetails({
          accId: res.wait[0].accId
        }));
      } else {
        yield put(actions.clearList({workDetails: {}}));
      }
    } else {
      yield put(actions.clearList({studentsList: {}, workDetails: {}}));
      yield put(actions.setLoading({studentsListLoading: false}));
      message.error('请求学生列表出错，请刷新页面重试', 5);
    }
  } catch (err) {
    yield put(actions.setLoading({studentsListLoading: false}));
    yield put(actions.clearList({studentsList: {}, workDetails: {}}));
    message.error(err.message, 5);
  }
}

function* fetchWaitStudents(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/${workId}`,
    });
    if (res) {
      const list = res && res.wait ? res.wait : [];
      const waitList = list.filter((item) => item.recordId);
      if (waitList.length > 0) {
        yield put(actions.fetchWorkDetails({
          accId: waitList[0].accId,
          recordId: waitList[0].recordId
        }));
      } else {
        message.success('当前没有未批改的了', 5);
        // yield put(actions.fetchClass());
      }
      //yield put(actions.fetchStudentsWaitSuccess(res && res.wait ? res.wait : []));
    } else {
      message.error('请求未批改学生列表出错，请刷新页面重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

function* fetchWorkDetails(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/stu-with-records/${action.payload.accId}`,
    });
    if (res) {
      currentAccId = action.payload.accId;
      //currentRecordId = action.payload.recordId;
      yield put(actions.fetchWorkDetailsSuccess({
        workDetails: res,
        currentAccId: action.payload.accId
      }));
    } else {
      yield put(actions.clearList({workDetails: {}}));
      message.error('请求详情数据出错，请刷新页面重试', 5);
    }
  } catch (err) {
    yield put(actions.clearList({workDetails: {}}));
    message.error(err.message, 5);
  }
}

// 点赞
function* likeOpt(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/like-opt`,
      method: 'POST',
      data: {
        islike: action.payload.islike,
        recordId: action.payload.recordId,
      }
    });
    if (res) {
      // 成功后修改数据
      yield put(actions.fetchWorkDetails({
        accId: currentAccId
      }));
    } else {
      message.error('点赞出错，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

// 赞赏小红花
function* rewardFlowers(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/reward/${currentAccId}/${action.payload}`,
    });
    if (res) {
      if (action.payload > 0 ) {
        message.success(`赠送${action.payload}朵小红花`, 5);
      } else {
        message.success(`扣除${action.payload}朵小红花`, 5);
      }
      
      yield put(actions.setVisible({ flowerVisible: false }));
      yield put(actions.fetchWorkDetails({
        accId: currentAccId,
      }));
    } else {
      message.error('赠送小红花失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

// 撤回评语
function* withdrawComment(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/del-comment/${action.payload}`
    });
    if (res) {
      // 关闭弹层
      message.success('撤回成功', 5);
      yield put(actions.setVisible({ undoVisible: false }));
      yield put(actions.fetchWorkDetails({
        accId: currentAccId
      }));
    } else {
      message.error('撤回出错，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

//添加评论
function* addComment(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/add-comment`,
      method: 'post',
      data: {
        ...action.payload.data,
      }
    });
    if (res) {
      // 关闭弹层
      if (action.payload.type === 'comment') {
        message.success('评论成功', 5);
        yield put(actions.setVisible({ commentsVisible: false }));
      } else if (action.payload.type === 'correcting') {
        message.success('批改成功', 5);
      }

      yield put(actions.fetchWorkDetails({
        accId: currentAccId
      }));
    } else {
      if (action.payload.type === 'comment') {
        message.error('添加出错，请重试', 5);
      } else if (action.payload.type === 'correcting') {
        message.success('批改出错', 5);
      }
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

// 撤回所有评语
function* withdrawAll(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/withdraw-all/${currentAccId}`
    });
    if (res) {
      // 关闭弹层
      message.success('撤回成功', 5);
      yield put(actions.setVisible({ undoVisible: false }));
      yield put(actions.fetchWorkDetails({
        accId: currentAccId
      }));
    } else {
      message.error('撤回出错，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

//批量添加评论
function* batchAddComment(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/add-comment/batch`,
      method: 'post',
      data: {
        ...action.payload,
      }
    });
    if (res) {
      // 关闭弹层
      message.success('评论成功', 5);
      yield put(actions.setVisible({ commentsVisible: false }));
      yield put(actions.fetchWorkDetails({
        accId: currentAccId
      }));
    } else {
      message.error('添加出错，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

// 批量赞赏小红花
function* batchRewardFlowers(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/reward/batch`,
      method: 'POST',
      data: action.payload,
    });
    if (res) {
      if (action.payload.num > 0 ) {
        message.success(`赠送${action.payload.num}朵小红花`, 5);
      } else {
        message.success(`扣除${action.payload.num}朵小红花`, 5);
      }
      
      yield put(actions.setVisible({ flowerVisible: false }));
      yield put(actions.fetchWorkDetails({
        accId: currentAccId,
      }));
    } else {
      message.error('赠送小红花失败，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

// 批量点赞
function* batchLikeOpt(action) {
  try {
    const res = yield call(fetch, {
      url: `${base.domain}/api/works/like-opt/batch`,
      method: 'POST',
      data: action.payload,
    });
    if (res) {
      // 成功后修改数据
      message.success('点赞成功', 5);
      yield put(actions.fetchWorkDetails({
        accId: currentAccId
      }));
    } else {
      message.error('点赞出错，请重试', 5);
    }
  } catch (err) {
    message.error(err.message, 5);
  }
}

export default function* rootSaga() {
  yield [
    takeLatest(FETCH_ClASS, fetchClass),
    takeLatest(FETCH_WORK, fetchWork),
    takeLatest(FETCH_STUDENTS, fetchStudents),
    takeLatest(FETCH_WORK_DETAILS, fetchWorkDetails),
    takeLatest(KIKE_OPT, likeOpt),
    takeLatest(REWARD_FLOWERS, rewardFlowers),
    takeLatest(WITHDRAW_COMMENT, withdrawComment),
    takeLatest(ADD_COMMENT, addComment),
    takeLatest(FETCH_WAIT_STUDENTS, fetchWaitStudents),
    takeLatest(WITHDRAW_ALL, withdrawAll),
    takeLatest(BATCH_KIKE_OPT, batchLikeOpt),
    takeLatest(BATCH_REWARD_FLOWERS, batchRewardFlowers),
    takeLatest(BATCH_ADD_COMMENT, batchAddComment),
  ];
}
