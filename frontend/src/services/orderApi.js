// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const orderApi = createApi({
//     reducerPath: "orderApi",
//     baseQuery: fetchBaseQuery({baseUrl: "/api/v1/order"}),
//     tagTypes: ["Order"],
//     endpoints: (builder) => ({
//         getAllOrder: builder.query({
//             query: ()=> '/',
//             providesTags: ["Order"]
//         }),
//         createOrder: builder.mutation({
//             query: (body) => ({
//                 url: '/',
//                 method: 'POST',
//                 body: body
//             }),
//             invalidatesTags: ['Order', 'Table']
//         })
//     })
// })
// export const {useGetAllOrderQuery, useCreateOrderMutation} = orderApi;