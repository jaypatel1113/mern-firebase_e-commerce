import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    AllCouponsResponse,
    CouponValidityResponse,
    CreatePaymentRequest,
    CreatePaymentResponse,
    DeleteCouponRequest,
    MessageResponse,
    NewCouponRequest,
} from "../../types/api-types";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
    }),

    tagTypes: ["coupons"],
    endpoints: (builder) => ({
        create: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
            query: (data) => ({
                url: `create`,
                method: "POST",
                body: data,
            }),
        }),
        newCoupon: builder.mutation<MessageResponse, NewCouponRequest>({
            query: ({ formData, userId }) => ({
                url: `coupon/new?id=${userId}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["coupons"],
        }),
        deleteCoupon: builder.mutation<MessageResponse, DeleteCouponRequest>({
            query: ({ couponId, userId }) => ({
                url: `coupon/${couponId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["coupons"],
        }),

        allCoupons: builder.query<AllCouponsResponse, string>({
            query: (id) => `/coupon/all?id=${id}`,
            providesTags: ["coupons"],
        }),
        couponValidity: builder.query<CouponValidityResponse, string>({
            query: (coupon) => `/discount?coupon=${coupon}`,
            providesTags: ["coupons"],
        }),
    }),
});

export const {
    useCreateMutation,
    useNewCouponMutation,
    useDeleteCouponMutation,
    useAllCouponsQuery,
    useCouponValidityQuery,
} = couponApi;
