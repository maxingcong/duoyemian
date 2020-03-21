import {  FETCH_LIST_SUCCESS, SET_LOADING, SET_SEARCH_PARAMS, FETCH_SUBTYPE_SUCCESS } from '../actions';
const assign = Object.assign;

const defaultState = {
  loading: true,
  fileList: [],         // 文件列表
  searchParams: {       // 搜索条件
    pageNo: 1,
    pageSize: 10,
    type: ''
  },
  subType: ['pdf','ppt','doc', 'xls']    // 文档子类型
};

function reducers(state = defaultState, action) {
  switch (action.type) {
  case SET_LOADING:
    return assign({}, state, {
      ...action.payload
    });
  case FETCH_LIST_SUCCESS:
    return assign({}, state, {
      loading: false,
      fileList: action.payload
    });
  case SET_SEARCH_PARAMS:
    return assign({}, state, {
      searchParams: action.payload,
    });
  case FETCH_SUBTYPE_SUCCESS:
    return assign({}, state, {
      subType: action.payload,
    });
  default:
    return state;
  }
}

export default reducers;
