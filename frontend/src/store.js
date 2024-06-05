import { configureStore } from '@reduxjs/toolkit';
import { usersApi, menuApi, tableApi, billsApi } from './services/api';
// import { orderApi } from './services/orderApi';


export const store = configureStore({
    reducer:{
        [usersApi.reducerPath]: usersApi.reducer,
        [menuApi.reducerPath]: menuApi.reducer,
        [tableApi.reducerPath]: tableApi.reducer,
        [billsApi.reducerPath]: billsApi.reducer
        // [orderApi.reducerPath]: orderApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware).concat(menuApi.middleware).concat(tableApi.middleware).concat(billsApi.middleware)//.concat(orderApi.middleware)
})