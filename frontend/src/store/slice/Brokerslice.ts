import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { baseurlagent } from "../api";
import { Query } from "mongoose";
import { Agent } from "../../interfacetypes/type";

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

interface Product {
  _id: string;
  companyname: string;
  weight: number;
  price: number;
  quantity: number;
}

interface OrderResponse {
  orders: any;
  success: boolean;
  result: Order[];
}
interface RefreshTokenResponse {
  token: string;
}

interface ProductListResponse {
  success: boolean;
  products: Product[];
}
interface MonthlyDistribution {
  month: string;
  value: number;
}

interface DashboardData {
  activeTickets: number;
  todaysAppointments: number;
  pendingReviews: number;
  monthlyDistribution: MonthlyDistribution[];
}

// Updated MonthlyDistributionChart component with proper typing
interface ChartProps {
  data: MonthlyDistribution[];
}
const baseQuery = fetchBaseQuery({
  baseUrl: baseurlagent,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("agentToken");
    if (token) {
      headers.set("AgentAuthorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/agentrefresh-token", method: "POST" },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      const newtoken = (refreshResult.data as RefreshTokenResponse).token;
      localStorage.setItem("agentToken", newtoken);
      const fetchArgs = typeof args === "string" ? { url: args } : args;

      let newHeaders: HeadersInit;

      if (fetchArgs.headers instanceof Headers) {
        newHeaders = new Headers(fetchArgs.headers);
      } else if (Array.isArray(fetchArgs.headers)) {
        newHeaders = fetchArgs.headers.reduce((acc, [key, value]) => {
          if (key && value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
      } else if (
        typeof fetchArgs.headers === "object" &&
        fetchArgs.headers !== null
      ) {
        newHeaders = fetchArgs.headers as Record<string, string>;
      } else {
        newHeaders = {};
      }

      if (newHeaders instanceof Headers) {
        newHeaders = Object.fromEntries(newHeaders.entries());
      }

      newHeaders = {
        ...newHeaders,
        Authorization: `Bearer ${newtoken}`,
      };

      console.log("New headers after refresh:", newHeaders);

      result = await baseQuery(
        {
          ...fetchArgs,
          headers: newHeaders,
        },
        api,
        extraOptions
      );
    } else {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return result;
};

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Agent", "Product", "OrderResponse", "Dashboard"],
  endpoints: (builder) => ({
    agentapply: builder.mutation({
      query: (formData) => ({
        url: "/apply",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    agentlogin: builder.mutation({
      query: ({ email, password }) => ({
        url: "/agentlogin",
        method: "POST",
        body: { email, password },
        credentials: "include",
      }),
    }),
    agentrefreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/agentrefresh-token",
        method: "POST",
      }),
    }),
    appProduct: builder.mutation({
      query: (formData) => ({
        url: "/addproduct",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
    listproduct: builder.query<ProductListResponse, void>({
      query: () => "/getproduct",
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    editproduct: builder.mutation({
      query: (formData) => ({
        url: "/editproduct",
        method: "PATCH",
        body: formData,
      }),
    }),
    deleteproduct: builder.mutation({
      query: ({ id }) => ({
        url: `/deleteproduct/${id}`,
        method: "DELETE",
        body: { id },
      }),
    }),
    orderlisting: builder.query<OrderResponse, void>({
      query: () => "/agentgetorders",
      providesTags: ["OrderResponse"],
    }),
    markorderdeliver: builder.mutation({
      query: (orderId) => ({
        url: `/orderstatus/${orderId}`,
        method: "PATCH",
        body: { orderId },
      }),
      async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Manually invalidate tags if necessary to update only specific parts
          dispatch(
            agentApi.util.invalidateTags([
              { type: "OrderResponse", id: orderId },
            ])
          );
        } catch (error) {
          console.error("Order delivery status update failed: ", error);
        }
      },
    }),
    getsales: builder.query<Agent[], string>({
      query: (agentId) => `/getsales/${agentId}`,
    }),
    agentlogout: builder.mutation<void, void>({
      query: () => ({
        url: "/agentlogout",
        method: "POST",
      }),
    }),
    dashboarddatas: builder.query<DashboardData, void>({
      query: () => ({
        url: "/agentdashboard",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useAgentapplyMutation,
  useAgentloginMutation,
  useAgentrefreshTokenMutation,
  useAppProductMutation,
  useLazyListproductQuery,
  useEditproductMutation,
  useDeleteproductMutation,
  useOrderlistingQuery,
  useMarkorderdeliverMutation,
  useGetsalesQuery,
  useAgentlogoutMutation,
  useDashboarddatasQuery,
} = agentApi;
