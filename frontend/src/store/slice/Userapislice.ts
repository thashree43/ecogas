import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseurluser } from "../api";
import { HttpMethod } from "../../schema/httpmethod";

interface User {
  success: any;
  _id: string;
  username: string;
  email: string;
  is_blocked: boolean;
  book: Array<{
    _id: string;
    name: string;
    consumerid: number;
    mobile: number;
    address: string;
    company: string;
    gender: string;
  }>;
  orders: Array<Order>;
}

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

interface GasProvider {
  _id: string;
  agentname: string;
  email: string;
  mobile: string;
  pincode: string;
  products: Array<{
    _id: string;
    companyname: string;
    weight: number;
    price: number;
    quantity: number;
  }>;
}

export const userApislice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseurluser,
    credentials: "include",
  }),
  tagTypes: ['User','GasProviders'],
  endpoints: (builder) => ({
    registerPost: builder.mutation({
      query: (formData) => ({
        url: "/register",
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ otp, email }) => ({
        url: "/verifyotp",
        method: "POST",
        body: { otp, email },
      }),
    }),
    resentotp: builder.mutation({
      query: (email) => ({
        url: "/resentotp",
        method: "POST",
        body: { email },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    googleregister: builder.mutation({
      query: (postData) => ({
        url: "/google-login",
        method: "POST",
        body: { postData },
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/resendotp",
        method: "POST",
        body: { email },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/resetpassword",
        method: "POST",
        body: { email },
      }),
    }),
    resetpassword: builder.mutation({
      query: (postdata) => ({
        url: "/updatepassword",
        method: "PATCH",
        body: postdata,
      }),
    }),
    adminlogin: builder.mutation({
      query: ({ email, password }) => ({
        url: "/adminlogin",
        method: "POST",
        body: { email, password },
      }),
    }),
    getusers: builder.query<User[], void>({
      query: () => "/get_user",
      providesTags: ['User'],
    }),
   
    updatestatus: builder.mutation<User, { id: string; is_blocked: boolean }>({
      query: ({ id, is_blocked }) => ({
        url: `/updatestatus/${id}`,
        method: "PATCH",
        body: { is_blocked },
      }),
      invalidatesTags: ['User'],
      async onQueryStarted({ id, is_blocked }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApislice.util.updateQueryData('getusers', undefined, (draft) => {
            const user = draft.find((user) => user._id === id);
            if (user) {
              user.is_blocked = is_blocked;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
     getProviders: builder.query<GasProvider[], string>({
      query: (pincode) => `/gas-providers/${pincode}`,
      providesTags: ['GasProviders'],
    }),
    // bookGas: builder.mutation<{ success: boolean }, BookingRequest>({
    //   query: (bookingData) => ({
    //     url: "/book-gas",
    //     method: HttpMethod.POST,
    //     body: bookingData,
    //   }),
    // }),
    addbook:builder.mutation({
      query:(formdata)=>({
        url:'/addbook',
        method:"POST",
        body:formdata
      })
    }),
    getbook: builder.query<User, string>({
      query: (userId) => `/getbook/${userId}`,
      transformResponse: (response: { success: boolean; books: User['book'] }) => {
        return {
          success: response.success,
          _id: '', 
          username: '',
          email: '',
          is_blocked: false,
          book: response.books,
          orders: [],
        };
      },
      providesTags: ["User"],
    }),
    deletebook: builder.mutation({
      query: (bookId) => ({
        url: `/deletebook/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    orderthegas:builder.mutation({
      query:(bookingData)=>({
        url:'/ordergas',
        method:"POST",
        body:bookingData
      })
    }),
    getorders: builder.query<{ orders: Order[] }, string>({
      query: (userId) => `/getorders/${userId}`,
    }),
  }),
});

export const {
  useRegisterPostMutation,
  useVerifyOtpMutation,
  useResentotpMutation,
  useLoginMutation,
  useGoogleregisterMutation,
  useForgotPasswordMutation,
  useResetpasswordMutation,
  useResendOtpMutation,
  useAdminloginMutation,
  useGetusersQuery,
  useUpdatestatusMutation,
  useGetProvidersQuery,
  useAddbookMutation,
  useGetbookQuery,
  useDeletebookMutation,
  useOrderthegasMutation,
  useGetordersQuery
} = userApislice;
 