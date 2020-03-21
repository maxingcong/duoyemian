// action types
export const FETCH_LIST = 'FETCH_LIST';
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS';
export const SET_LOADING = 'SET_LOADING';
export const SET_SEARCH_PARAMS = 'SET_SEARCH_PARAMS';
export const REVIVIFICATION = 'REVIVIFICATION';
export const BATCH_DELETE = 'BATCH_DELETE';
export const DELETE_RECORD = 'DELETE_RECORD';
export const REST_NAME = 'REST_NAME';
export const FETCH_SUBTYPE = 'FETCH_SUBTYPE';
export const FETCH_SUBTYPE_SUCCESS = 'FETCH_SUBTYPE_SUCCESS';
export const FETCH_TOKEN = 'FETCH_TOKEN';
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
  setLoading: data => ({
    type: SET_LOADING,
    payload: data
  }),
  setSearchParams: data => ({
    type: SET_SEARCH_PARAMS,
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
  restName: data => ({
    type: REST_NAME,
    payload: data
  }),
  fetchSubType: data => ({
    type: FETCH_SUBTYPE,
    payload: data
  }),
  fetchSubTypeSuccess: data => ({
    type: FETCH_SUBTYPE_SUCCESS,
    payload: data
  }),
  fetchToken: data => ({
    type: FETCH_TOKEN,
    payload: data
  })
};
