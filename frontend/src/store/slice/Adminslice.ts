import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { basseurladmin } from '../api';

interface AgentResponse {
  success: boolean;
  agents: {
    _id: string;
    agentname: string;
    email: string;
    is_Approved: boolean;
  }[];
}
interface OrderResponse{
  success:boolean;
  orders:{
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
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: basseurladmin,
    credentials: 'include',
  }),
  tagTypes: ['Agent','Orders'],
  endpoints: (builder) => ({
    getallagent: builder.query<AgentResponse, void>({
      query: () => '/get_agent',
      providesTags: ['Agent'],
    }),
  
    updateapproval: builder.mutation<AgentResponse,{id:string,is_Approved:boolean}>({
        query:({id,is_Approved})=>({
            url:`/updateapproval/${id}`,
            method:'PATCH',
            body:{is_Approved}
        }),
        invalidatesTags: ['Agent'],
    }),
    getfullorders:builder.query<OrderResponse,void>({
      query:()=>'/admingetorders',
      providesTags: ['Orders'],
  
    })
  }),
 
});

export const { 
    useGetallagentQuery,
    useUpdateapprovalMutation,
    useGetfullordersQuery
} = adminApi;
