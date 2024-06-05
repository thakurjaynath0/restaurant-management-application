import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const usersApi = createApi({
    reducerPath:'authApi',
    baseQuery:fetchBaseQuery({baseUrl: '/api/v1/users'}),
    tagTypes:['User'],
    endpoints:(builder) => ({
        login:builder.mutation({
            query:({username, password}) => ({
                url:'/auth/login/',
                method: 'POST',
                body:{username, password},
            }),
            invalidatesTags:(result, error, args) => !error && ['User']
        }),

        logout:builder.mutation({
            query: () => ({
                url: '/auth/logout/',
                method: "GET"
            }),
            invalidatesTags:['User']
        }),

        allUsers:builder.query({
            query:() => '/',
            providesTags:['User']
        }),
        currentUser:builder.query({
            query:() => '/me',
            providesTags:(result, error, args) => !error && result ? [{ type:'User', id:result?.id}] : ['User']
        }),

        singleUser:builder.query({
            query:(_id) => `/${_id}/`,
            providesTags:['User']
        }),
        createUser: builder.mutation({
            query: (body) => ({
                url: `/`,
                method: 'POST',
                body: body
            }),
            invalidatesTags:(result, error, args) => !error && ['User']
        }),

        editUser: builder.mutation({
            query: ({_id, ...rest}) => ({
                url: `/${_id}`,
                method: 'PATCH',
                body: {_id, ...rest}
            }),
            invalidatesTags: (result, error, args) => !error && [{ type:'User', id:args._id}, 'User']
        }),
        deleteUser: builder.mutation({
            query: ({_id}) => ({
                url: `/${_id}`,
                method: 'DELETE',
                body: {}
            }),
            invalidatesTags: (result, error, args) => !error && ['User']
        }),
        resetPassword: builder.mutation({
            query: ({_id, password}) => ({
                url: `/${_id}/resetPassword`,
                method: 'POST',
                body: {password}
            }),
            // invalidatesTags: ['User']
        }),
        uploadImage: builder.mutation({
            query: (img) => ({
                headers: {
                    // "content-type": "multipart/form-data; boundary=MyBoundry",
                }, 
                
                url: `/profilePic`,
                method: 'POST',
                body: img
            }),
            // invalidatesTags: ['User']
        }),
    })
})

export const tableApi = createApi({
    reducerPath:'tableApi',
    baseQuery:fetchBaseQuery({baseUrl: '/api/v1'}),
    tagTypes:['Table', 'Order'],
    endpoints:(builder) => ({
        getTables:builder.query({
            query:() => '/table',
            providesTags:['Table']
        }),
        getSingleTable:builder.query({
            query:(_id) => `/table/${_id}`,
            providesTags:['Table']
        }),
        
        createTable:builder.mutation({
            query:({number}) => ({
                url:'/table',
                method:'POST',
                body:{number}
            }),
            invalidatesTags:['Table']
        }),

        updateTable:builder.mutation({
            query:({ _id, number}) => ({
                url:`/table/${_id}`,
                method:'PATCH',
                // headers: ,
                body:{number}
            }),
            invalidatesTags:(result, error, arg) => !error && ['Table']
        }),

        deleteTable:builder.mutation({
            query:({_id}) => ({
                url:`table/${_id}`,
                method:'DELETE',
            }),
            invalidatesTags: (result, error, args) => !error && ['Table']
        }),

        // order

        getAllOrder: builder.query({
            query: (query) => '/order?'+ (query?.queryString || ""),
            providesTags: ["Order"]
        }),
        getOneOrder: builder.query({
            query: ({_id})=> `/order/${_id}`,
            providesTags: ["Order", "Table"]
        }),
        createOrder: builder.mutation({
            query: (body) => ({
                url: '/order',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Order', 'Table']
        }),
        //edit order one
        addTableEditOrder: builder.mutation({
            query: ({_id, table})=> ({
                url:`/order/${_id}/?action=add_table`,
                method: "PATCH",
                body: {table}
            }),
            invalidatesTags: ['Order', 'Table']
            // invalidatesTags:(result, error, arg) => !error && [{type:"Order", id:arg._id}, "Table"],
        }),
        removeTableEditOrder: builder.mutation({
            query: ({_id, table})=> ({
                url:`/order/${_id}/?action=remove_table`,
                method: "PATCH",
                body: {table}
            }),
            invalidatesTags: ['Order', 'Table']
            // invalidatesTags:(result, error, arg) => !error && [{type:"Order", id:arg._id}, "Table"],
        }),
        addItemEditOrder: builder.mutation({
            query: ({_id, ...rest})=> ({
                url:`/order/${_id}/?action=add_item`,
                method: "PATCH",
                body: {...rest}
            }),
            invalidatesTags: ['Order', 'Table']
            // invalidatesTags:(result, error, arg) => !error && [{type:"Order", id:arg._id}, "Table"],
        }),
        removeItemEditOrder: builder.mutation({
            query: ({_id, item})=> ({
                url:`/order/${_id}/?action=remove_item`,
                method: "PATCH",
                body: {item}
            }),
            invalidatesTags: ['Order', 'Table']
            // invalidatesTags:(result, error, arg) => !error && [{type:"Order", id:arg._id}, "Table"],
        }),
        updateItemEditOrder: builder.mutation({
            query: ({_id, ...rest})=> ({
                url:`/order/${_id}/?action=update_item`,
                method: "PATCH",
                body: {...rest}
            }),
            invalidatesTags: ['Order', 'Table']
            // invalidatesTags:(result, error, arg) => !error && [{type:"Order", id:arg._id}, "Table"],
        }),
        completeOrder: builder.mutation({
            query: ({_id})=> ({
                url: `/order/${_id}/complete`,
                method: "POST"
            }),
            invalidatesTags: ['Order', 'Table']
        }),
        cancelOrder: builder.mutation({
            query: ({_id})=> ({
                url: `/order/${_id}/cancel`,
                method: "POST"
            }),
            invalidatesTags: ['Order', 'Table']
        })
        
    })  
});


export const menuApi = createApi({
    reducerPath:'menuApi',
    baseQuery:fetchBaseQuery({baseUrl: '/api/v1/menu'}),
    tagTypes:['Items', 'Category'],
    endpoints:(builder) => ({
        allCategories:builder.query({
            query:(_id) => '/category',
            providesTags:(result, error, arg) => !error && result ? [
                ...result?.category.map(({ _id }) => ({type:'Category', id:_id}))
            ] : ['Category']
        }),

        updateCategory:builder.mutation({
            query:({_id, name}) => ({
                url:`/category/${_id}`,
                method:'PATCH',
                body:{name}
            }),
            invalidatesTags:(result, error, arg) => !error && [{type:'Category', id:arg._id}],
        }),

        addCategory:builder.mutation({
            query:({ name }) => ({
                url:'/category/',
                method:'POST',
                body:{name}
            }),
            invalidatesTags:(result, error, arg) => !error && ['Category',{type:'Category', id:result.category._id}]
        }),
        
        categoryItems:builder.query({
            query: _id => `/categoryItems/${_id}`,
            providesTags:(result, error, arg) => [{type:'Items', id:arg}]
        }),
        allMenuItems: builder.query({
            query: ()=> `/`,
            providesTags: ['Items']
        }),
        singleMenuItem: builder.query({
            query: ({ _id })=> `${_id}`,
            providesTags: (result, error, arg) => !error && [{type:'Items', id:arg}]
        }),
        uploadMenuItemImage: builder.mutation({
            query: (img) => ({
                url:'/itemImage',
                method:'POST',
                body:img
            })
        }),

        addMenuItem:builder.mutation({
            query:({ category, name, price, image}) => ({
                url:'/',
                method:'POST',
                body:{category, name, price, image}
            }),
            invalidatesTags:(result, error, arg) => !error && [{type:'Items', id:arg.category}]
        }),

        updateMenuItem:builder.mutation({
            query:({ _id, name, price, category, image }) => ({
                url:`/${_id}`,
                method:'PATCH',
                // headers: ,
                body:{name, price, image}
            }),
            invalidatesTags:(result, error, arg) => !error && [{type:'Items', id:arg.category}]
        }),

        deleteMenuItem:builder.mutation({
            query:({_id, category}) => ({
                url:`/${_id}`,
                method:'DELETE',
            }),
            invalidatesTags:(result, error, arg) => !error && [{type:'Items', id:arg.category}]
        })
    })  
});


export const billsApi = createApi({
    reducerPath:'billsApi',
    baseQuery:fetchBaseQuery({baseUrl: '/api/v1/bill'}),
    tagTypes: ['Bills', 'Bill'],
    endpoints:(builder => ({
        allBills: builder.query({
            query:({ queryString }) => '?'+queryString,
            providesTags: ['Bills']
        }),
        getBill: builder.query({
            query:(id) => `/${id}`,
            providesTags:(result, error, arg) => [{ type:'Bill', id:arg }]
        }),
        settleBill: builder.mutation({
            query:({ id, ...rest }) => ({
                url:`/${id}/settle`,
                method:'POST',
                body:{...rest}
            }),
            invalidatesTags:(result, error, arg) => !error && [{ type:'Bill', id:arg.id }]
        })
    }))
})


export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useAllUsersQuery,
    useSingleUserQuery,
    useCreateUserMutation,
    useEditUserMutation,
    useDeleteUserMutation,
    useResetPasswordMutation,
    useUploadImageMutation,
    useCurrentUserQuery
} = usersApi;

export const {
    useAllCategoriesQuery,
    useCategoryItemsQuery,
    useUpdateCategoryMutation,
    useAddCategoryMutation,
    useUploadMenuItemImageMutation,
    useAddMenuItemMutation,
    useSingleMenuItemQuery,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
    useAllMenuItemsQuery
} = menuApi;

export const {
    useGetTablesQuery,
    useGetSingleTableQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
    useCreateOrderMutation,
    useGetAllOrderQuery,
    useGetOneOrderQuery,
    useAddTableEditOrderMutation,
    useRemoveTableEditOrderMutation,
    useAddItemEditOrderMutation,
    useRemoveItemEditOrderMutation,
    useUpdateItemEditOrderMutation,
    useCompleteOrderMutation,
    useCancelOrderMutation
} = tableApi;

export const {
    useAllBillsQuery,
    useGetBillQuery,
    useSettleBillMutation
} = billsApi;