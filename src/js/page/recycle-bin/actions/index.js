// action types
export const FETCH_LIST = 'FETCH_LIST';
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS';
export const REVIVIFICATION = 'REVIVIFICATION';
export const BATCH_DELETE = 'BATCH_DELETE';
export const DELETE_RECORD = 'DELETE_RECORD';
export const FETCH_TOKEN = 'FETCH_TOKEN';
export const SET_LOADING = 'SET_LOADING';
export const BATCH_REVIVIFICATION = 'BATCH_REVIVIFICATION';
export const CLEAR_LIST = 'CLEAR_LIST';

// action creator
export const actions = {
  fetchList: data => ({
    type: FETCH_LIST,
    payload: data
  }),
  fetchListSuccess: data => ({
    type: FETCH_LIST_SUCCESS,
    payload: data
  }),
  revivification: data => ({
    type: REVIVIFICATION,
    payload: data
  }),
  batchDelete: data => ({
    type: BATCH_DELETE,
    payload: data
  }),
  deleteRecord: data => ({
    type: DELETE_RECORD,
    payload: data
  }),
  fetchToken: data => ({
    type: FETCH_TOKEN,
    payload: data
  }),
  setLoading: data => ({
    type: SET_LOADING,
    payload: data
  }),
  batchRevivification: data => ({
    type: BATCH_REVIVIFICATION,
    payload: data
  }),
  clearList: data => ({
    type: CLEAR_LIST,
    payload: data
  }),
};
