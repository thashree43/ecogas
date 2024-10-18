import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { basseurladmin } from "../api";
import { Order, CompanyData } from "../../interfacetypes/type";
interface AgentResponse {
  success: boolean;
  agents: {
    _id: string;
    agentname: string;
    email: string;
    is_Approved: boolean;
  }[];
}

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
}

interface OrderResponse {
  success: boolean;
  orders: {
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
  }[];
}

interface RefreshTokenResponse {
  token: string;
}
interface Message {
  _id: string;
  content: string;
  sender: string;
  createdAt: Date;
}
type Messages = Message[];
interface chat {
  length: number;
  map: any;
  _id: string;
  chatname: string;
  user: User[];
  admin: User[];
  latestmessages: Message[];
}
interface Agent {
  _id: string;
  agentname: string;
  email: string;
  mobile: number;
  password: string;
  pincode: number;
  is_Approved: boolean;
  image: string;
  products: CompanyData[];
  orders: Order[];
}
const baseQuery = fetchBaseQuery({
  baseUrl: basseurladmin,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      console.log("No token found in localStorage");
    }

    console.log("All headers:");
    headers.forEach((value, key) => {});

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
    console.log("Token expired, attempting to refresh...");

    const refreshResult = await baseQuery(
      { url: "/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = (refreshResult.data as RefreshTokenResponse).token;

      localStorage.setItem("adminToken", newToken);

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
        Authorization: `Bearer ${newToken}`,
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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Agent", "Orders", "User"],
  endpoints: (builder) => ({
    adminlogin: builder.mutation<
      {
        refreshToken(arg0: string, refreshToken: any): unknown;
        success: any;
        token: string;
      },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "/adminlogin",
        method: "POST",
        body: { email, password },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/adminlogout",
        method: "POST",
      }),
    }),
    getusers: builder.query<User[], void>({
      query: () => "/get_user",
      providesTags: ["User"],
    }),
    updatestatus: builder.mutation<
      { success: boolean },
      { id: string; is_blocked: boolean }
    >({
      query: ({ id, is_blocked }) => ({
        url: `/updatestatus/${id}`,
        method: "PATCH",
        body: { is_blocked },
      }),
      async onQueryStarted({ id, is_blocked }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData(
            "getusers",
            undefined,
            (draft: User[]) => {
              const user = draft.find((user: User) => user._id === id);
              if (user) {
                user.is_blocked = is_blocked;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getallagent: builder.query<AgentResponse, void>({
      query: () => "/get_agent",
      providesTags: ["Agent"],
    }),
    updateapproval: builder.mutation<
      { success: boolean },
      { id: string; is_Approved: boolean }
    >({
      query: ({ id, is_Approved }) => ({
        url: `/updateapproval/${id}`,
        method: "PATCH",
        body: { is_Approved },
      }),
      async onQueryStarted({ id, is_Approved }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData(
            "getallagent",
            undefined,
            (draft: AgentResponse) => {
              const agent = draft.agents.find((agent) => agent._id === id);
              if (agent) {
                agent.is_Approved = is_Approved;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getfullorders: builder.query<OrderResponse, void>({
      query: () => "/admingetorders",
      providesTags: ["Orders"],
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/refresh-token",
        method: "POST",
      }),
    }),
    getcustomers: builder.query<chat[], void>({
      query: () => "/getcustomer",
    }),
    getMessages: builder.query<Message[], string>({
      query: (chatId) => `/getmessages/${chatId}`,
    }),
    sendMessage: builder.mutation<
      void,
      { chatId: string; content: string; adminToken: string }
    >({
      query: ({ chatId, content, adminToken }) => ({
        url: `/sendmessage`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: { chatId, content },
      }),
    }),
    saleslists: builder.query<Agent[], void>({
      query: () => "/saleslists",
    }),
  }),
});

export const {
  useAdminloginMutation,
  useLogoutMutation,
  useGetusersQuery,
  useUpdatestatusMutation,
  useGetallagentQuery,
  useUpdateapprovalMutation,
  useGetfullordersQuery,
  useRefreshTokenMutation,
  useGetcustomersQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useSaleslistsQuery,
} = adminApi;
