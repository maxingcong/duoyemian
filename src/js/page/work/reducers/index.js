import {
   FETCH_CLASS_SUCCESS, FETCH_DATA_SUCCESS, FETCH_WORK_DETAILS_SUCCESS, FETCH_STUDENTS_SUCCESS,
   FETCH_WORK_SUCCESS, SUBMIT_COMMENTS_SUCCESS, SET_LOADING, SET_VISIBLE, CLEAR_LIST, SET_COMMENTSID,
   FETCH_WAIT_STUDENTS_SUCCESS, SET_CURRENT_RECORDID, SORT_LIST, SET_STUDENTS_LIST, SET_BATCH_IDS
 } from '../actions';
const assign = Object.assign;

const defaultState = {
  loading: true,
  workListLoading: false,
  studentsListLoading: false,
  workDetailsLoading: false,
  classList: [],             // 班级列表
  workDetails: {},           // 作业详情
  workList: [],              // 工作列表
  studentsList: {},          // 学生列表
  currentClassId: '',        // 当前班级ID
  currentStudentsId: '',     // 当前学生ID
  currentWorkId: '',         // 当前作业ID
  commentsVisible: false,    // 评语弹层
  flowerVisible: false,       // 小红花弹层
  undoVisible: false,
  activeTab: 1,
  currentAccId: '',           // 当前接收Id
  currentRecordId: '',        // 当前RecordId
  commentsId: '',             // 评论ID
  watiStudentsList: [],       // 待批改学生列表
  isBatch: false,             // 是否批量修改
  accIds: [],                 // 批量接收ID
  recordIds: [],              // 批量记录ID
};

function reducers(state = defaultState, action) {
  switch (action.type) {
  case FETCH_CLASS_SUCCESS:
    return assign({}, state, {
      loading: false,
      activeTab: 1,
      classList: action.payload
    });
  case FETCH_DATA_SUCCESS:
    return assign({}, state, {
      loading: false,
      ...action.payload
    });
  case FETCH_WORK_DETAILS_SUCCESS:
    return assign({}, state, {
      loading: false,
      workDetails: action.payload.workDetails,
      currentAccId: action.payload.currentAccId
    });
  case FETCH_STUDENTS_SUCCESS:
    console.log('FETCH_STUDENTS_SUCCESS', action.payload);
    return assign({}, state, {
      studentsListLoading: false,
      studentsList: { ...action.payload.studentsList},
      currentWorkId: action.payload.currentWorkId
    });
  case FETCH_WORK_SUCCESS:
    return assign({}, state, {
      loading: false,
      workList: action.payload
    });
  case SUBMIT_COMMENTS_SUCCESS:
    return assign({}, state, {
      loading: false,
      workDetails: action.payload
    });
  case SET_LOADING:
    return assign({}, state, {
      ...action.payload
    });
  case SET_VISIBLE:
    return assign({}, state, {
      ...action.payload
    });
  case CLEAR_LIST:
    return assign({}, state, {
      ...action.payload
    });
  case SET_COMMENTSID:
    return assign({}, state, {
      commentsId: action.payload
    });
  case FETCH_WAIT_STUDENTS_SUCCESS:
    return assign({}, state, {
      watiStudentsList: action.payload
    });
  case SET_CURRENT_RECORDID:
    return assign({}, state, {
      currentRecordId: action.payload
    });
  case SORT_LIST:
    return assign({}, state, {
      ...action.payload
    });
  case SET_STUDENTS_LIST:
    return assign({}, state, {
      studentsList: action.payload
    });
  case SET_BATCH_IDS:
    return assign({}, state, {
      ...action.payload
    });
  default:
    return state;
  }
}

export default reducers;
