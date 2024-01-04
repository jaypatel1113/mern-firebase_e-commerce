import { configureStore } from "@reduxjs/toolkit";

import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { orderApi } from "./api/orderAPI";
import { couponApi } from "./api/paymentAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { dashboardApi } from "./api/dashboardAPI";

export const server = import.meta.env.VITE_SERVER;
export const conversion_rate = import.meta.env.VITE_CONVERSION_RATE;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,

        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (mid) => [
        ...mid(),
        userAPI.middleware,
        productAPI.middleware,
        orderApi.middleware,
        couponApi.middleware,
        dashboardApi.middleware,
    ],
});

export type RootState = ReturnType<typeof store.getState>;
