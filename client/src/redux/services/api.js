import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      const tenantId =
        getState().tenant?.activeTenant?._id ||
        getState().tenant?.activeTenant?.id ||
        localStorage.getItem("tenantId");

      if (tenantId) {
        headers.set("x-tenant-id", tenantId);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});
