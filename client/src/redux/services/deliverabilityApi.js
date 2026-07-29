import { api } from "./api";

export const deliverabilityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeliverabilityMetrics: builder.query({
      query: (timeframe = "24h") =>
        `/deliverability/metrics?timeframe=${timeframe}`,
      providesTags: [{ type: "Deliverability", id: "METRICS" }],
    }),

    getWarmupProgress: builder.query({
      query: (domainId) => `/deliverability/warmup/${domainId}`,
      providesTags: (result, error, domainId) => [
        { type: "Deliverability", id: `WARMUP_${domainId}` },
      ],
    }),

    getSuppressions: builder.query({
      query: (params = {}) => ({
        url: "/deliverability/suppressions",
        params, // { type: 'HARD' | 'SOFT' | 'COMPLAINT', page, limit }
      }),
      providesTags: ["Suppression"],
    }),

    removeSuppression: builder.mutation({
      query: (email) => ({
        url: `/deliverability/suppressions/${encodeURIComponent(email)}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "Suppression",
        { type: "Deliverability", id: "METRICS" },
      ],
    }),
  }),
});

export const {
  useGetDeliverabilityMetricsQuery,
  useGetWarmupProgressQuery,
  useGetSuppressionsQuery,
  useRemoveSuppressionMutation,
} = deliverabilityApi;
