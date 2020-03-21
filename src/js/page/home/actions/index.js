// action types 
export const FETCH_UUID = 'FETCH_UUID';
export const FETCH_UUID_SUCCESS = 'FETCH_UUID_SUCCESS';

export const FETCH_STATUS = 'FETCH_STATUS';
export const FETCH_STATUS_SUCCESS = 'FETCH_STATUS_SUCCESS';

export const CLEAR_STATUS = 'CLEAR_STATUS';

export const FETCH_TOKEN = 'FETCH_TOKEN';

// action creator
export const actions = {
  fetchUuid: () => ({
    type: FETCH_UUID,
  }),
  fetchUuidSuccess: data => ({
    type: FETCH_UUID_SUCCESS,
    payload: data,
  }),

  fetchStatus: data => ({
    type: FETCH_STATUS,
    payload: data
  }),
  fetchStatusSuccess: data => ({
    type: FETCH_STATUS_SUCCESS,
    payload: data,
  }),

  clearStatus: () => ({
    type: CLEAR_STATUS
  }),
  
  fetchToken: data => ({
    type: FETCH_TOKEN,
    payload: data
  })
};
