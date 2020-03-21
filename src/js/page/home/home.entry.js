import 'app/util/polyfills.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import createStore from './store/createStore';
import App from './containers/app';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(sagaMiddleware);
sagaMiddleware.run(rootSaga);

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
}

// try {
//   const initialData = JSON.parse(window.globalData);
//   store.dispatch(actions.fetchDataSuccess(initialData));
// } catch(e) {
//   message.error('数据初始化出错', 5);
// }

render();
store.subscribe(render);
