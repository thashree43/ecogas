import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseurlagent } from '../api';

interface Order {
  _id: string;
  name: string;
  address: string;
  mobile: number;
  consumerid: number;
  company: string;
  price: number;
  paymentmethod: string;
  expectedat: Date;
  status: string;
}

interface AgentResponse {
  success: boolean;
  _id: string;
  agentname: string;
  email: string;
  is_Approved: boolean;
  orders: Order[];
}

interface Product {
  _id: string;
  companyname: string;
  weight: number;
  price: number;
  quantity: number;
}

interface OrderResponse {
  success: boolean;
  result: Order[];
}


interface ProductListResponse {
  success: boolean;
  products: Product[];
}

export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseurlagent,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('agentToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Agent', 'Product', 'OrderResponse'],
  endpoints: (builder) => ({
    agentapply: builder.mutation({
      query: (formData) => ({
        url: '/apply',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),
    agentlogin: builder.mutation({
      query: ({ email, password }) => ({
        url: '/agentlogin',
        method: 'POST',
        body: { email, password },
        credentials: 'include',
      }),
    }),
    appProduct: builder.mutation({
      query: (formData) => ({
        url: '/addproduct',
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
    }),
    listproduct: builder.query<ProductListResponse, void>({
      query: () => '/getproduct',
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
    editproduct: builder.mutation({
      query: (formData) => ({
        url: '/editproduct',
        method: "PATCH",
        body: formData
      })
    }),
    deleteproduct:builder.mutation({
      query:({id})=>({
        url:`/deleteproduct/${id}`,
        method:"DELETE",
        body:{id}
      })
    }),
    orderlisting: builder.query<OrderResponse, void>({
      query: () => '/agentgetorders',
      providesTags: ['OrderResponse'],
    }),
    markorderdeliver: builder.mutation({
      query:(orderId)=>({
        url:`/orderstatus/${orderId}`,
        method:"PATCH",
        body:orderId
      })
    })
  }),
});

export const {
  useAgentapplyMutation,
  useAgentloginMutation,
  useAppProductMutation,
  useLazyListproductQuery,
  useEditproductMutation,
  useDeleteproductMutation,
  useOrderlistingQuery,
  useMarkorderdeliverMutation,
} = agentApi;