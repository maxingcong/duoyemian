// action types
export const FETCH_ClASS = 'FETCH_ClASS';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_CLASS_SUCCESS = 'FETCH_CLASS_SUCCESS';
 
export const FETCH_WORK = 'FETCH_WORK';
export const FETCH_WORK_SUCCESS = 'FETCH_WORK_SUCCESS';
export const FETCH_STUDENTS = 'FETCH_STUDENTS';
export const FETCH_STUDENTS_SUCCESS = 'FETCH_STUDENTS_SUCCESS';
export const FETCH_WORK_DETAILS = 'FETCH_WORK_DETAILS';
export const FETCH_WORK_DETAILS_SUCCESS = 'FETCH_WORK_DETAILS_SUCCESS';
export const REWARD_FLOWERS = 'REWARD_FLOWERS';
export const KIKE_OPT = 'KIKE_OPT';
export const SUBMIT_COMMENTS = 'SUBMIT_COMMENTS';
export const SUBMIT_COMMENTS_SUCCESS = 'SUBMIT_COMMENTS_SUCCESS';
export const SET_LOADING = 'SET_LOADING';
export const SET_VISIBLE = 'SET_VISIBLE';
export const WITHDRAW_COMMENT = 'WITHDRAW_COMMENT';
export const CLEAR_LIST = 'CLEAR_LIST';
export const SET_COMMENTSID = 'SET_COMMENTSID';
export const ADD_COMMENT = 'ADD_COMMENT';
export const FETCH_WAIT_STUDENTS = 'FETCH_WAIT_STUDENTS';
export const FETCH_WAIT_STUDENTS_SUCCESS = 'FETCH_WAIT_STUDENTS_SUCCESS';
export const SET_CURRENT_RECORDID = 'SET_CURRENT_RECORDID';
export const SORT_LIST = 'SORT_LIST';
export const WITHDRAW_ALL = 'WITHDRAW_ALL';
export const SET_STUDENTS_LIST = 'SET_STUDENTS_LIST';
export const BATCH_ADD_COMMENT = 'BATCH_ADD_COMMENT';
export const BATCH_REWARD_FLOWERS = 'BATCH_REWARD_FLOWERS';
export const BATCH_KIKE_OPT = 'BATCH_KIKE_OPT';
export const SET_BATCH_IDS = 'SET_BATCH_IDS';

// action creator
export const actions = {
  fetchClass: () => ({
    type: FETCH_ClASS,
  }),
  fetchClassSuccess: data => ({
    type: FETCH_CLASS_SUCCESS,
    payload: data
  }),
  fetchDataSuccess: data => ({
    type: FETCH_DATA_SUCCESS,
    payload: data
  }),
  fetchWork: data => ({
    type: FETCH_WORK,
    payload: data
  }),
  fetchWorkSuccess: data => ({
    type: FETCH_WORK_SUCCESS,
    payload: data
  }),
  fetchStudents: data => ({
    type: FETCH_STUDENTS,
    payload: data
  }),
  fetchStudentsSuccess: data => ({
    type: FETCH_STUDENTS_SUCCESS,
    payload: data
  }),
  fetchWorkDetails: data => ({
    type: FETCH_WORK_DETAILS,
    payload: data
  }),
  fetchWorkDetailsSuccess: data => ({
    type: FETCH_WORK_DETAILS_SUCCESS,
    payload: data
  }),
  likeOpt: data => ({
    type: KIKE_OPT,
    payload: data
  }),
  batchLikeOpt: data => ({
    type: BATCH_KIKE_OPT,
    payload: data
  }),
  rewardFlowers: data => ({
    type: REWARD_FLOWERS,
    payload: data
  }),
  batchRewardFlowers: data => ({
    type: BATCH_REWARD_FLOWERS,
    payload: data
  }),
  submitComments: data => ({
    type: SUBMIT_COMMENTS,
    payload: data
  }),
  submitCommentsSuccess: data => ({
    type: SUBMIT_COMMENTS_SUCCESS,
    payload: data
  }),
  setLoading: data => ({
    type: SET_LOADING,
    payload: data
  }),
  setVisible: data => ({
    type: SET_VISIBLE,
    payload: data
  }),
  withdrawComment: data => ({
    type: WITHDRAW_COMMENT,
    payload: data
  }),
  clearList: data => ({
    type: CLEAR_LIST,
    payload: data
  }),
  setCommentsId: data => ({
    type: SET_COMMENTSID,
    payload: data
  }),
  addComment: data => ({
    type: ADD_COMMENT,
    payload: data
  }),
  batchAddComment: data => ({
    type: BATCH_ADD_COMMENT,
    payload: data
  }),
  fetchWaitStudents: data => ({
    type: FETCH_WAIT_STUDENTS,
    payload: data
  }),
  fetchWaitStudentsSuccess: data => ({
    type: FETCH_WAIT_STUDENTS_SUCCESS,
    payload: data
  }),
  setCurrentRecordId: data => ({
    type: SET_CURRENT_RECORDID,
    payload: data
  }),
  sortList: data => ({
    type: SORT_LIST,
    payload: data
  }),
  withdrawAll: data => ({
    type: WITHDRAW_ALL,
    payload: data
  }),
  setStudentsList: data => ({
    type: SET_STUDENTS_LIST,
    payload: data
  }),
  setBatchIds: data => ({
    type: SET_BATCH_IDS,
    payload: data
  }),
};
