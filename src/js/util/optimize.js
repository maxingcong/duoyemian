import { is } from 'immutable';

const optimize = (nextProps = {}, nextState = {}, thisProps = {}, thisState = {}) => {
  nextProps = nextProps || {};
  nextState = nextState || {};
  thisState = thisState || {};
  thisProps = thisProps || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
    Object.keys(thisState).length !== Object.keys(nextState).length) {
    return true;
  }

  for (const key in nextProps) {
    if (!is(thisProps[key], nextProps[key])) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key] && !is(thisState[key], nextState[key])) {
      return true;
    }
  }
  return false;
};

export default optimize;