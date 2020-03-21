import { FETCH_UUID_SUCCESS, FETCH_STATUS_SUCCESS, CLEAR_STATUS } from '../actions';
const assign = Object.assign;

const defaultState = {
  loading: false,
  uuid: null,
  status: {},
};

function reducers(state = defaultState, action) {
  switch (action.type) {
  case FETCH_UUID_SUCCESS:
    return assign({}, state, {
      uuid: action.payload,
    });
  
  case FETCH_STATUS_SUCCESS:
    return assign({}, state, {
      status: action.payload,
    });
  
  case CLEAR_STATUS:
    return assign({}, state, {
      status: {}
    });
  default:
    return state;
  }
}

export default reducers;
