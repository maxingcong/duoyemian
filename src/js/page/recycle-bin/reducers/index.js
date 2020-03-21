import {  FETCH_LIST_SUCCESS, SET_LOADING, SET_SEARCH_PARAMS } from '../actions';
const assign = Object.assign;

const defaultState = {
  loading: true,
  fileList: {},         // 文件列表
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
      loading: false,
    });
  default:
    return state;
  }
}

export default reducers;
