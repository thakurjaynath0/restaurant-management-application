import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';
import {AppProvider} from './context';
import {NotificationProvider} from './contexts/notificationContext'
import {Provider} from 'react-redux';
import { store } from './store';
import { SocketProvider } from './contexts/socketContext';



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProvider>
        <NotificationProvider>
          <SocketProvider>
            <App/>
          </SocketProvider>
        </NotificationProvider>
      </AppProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register()