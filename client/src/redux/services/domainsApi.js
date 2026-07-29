import { api } from "./api";

export const domainsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDomains: builder.query({
      query: () => "/domains",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Domain", id })),
              { type: "Domain", id: "LIST" },
            ]
          : [{ type: "Domain", id: "LIST" }],
    }),

    getDomainById: builder.query({
      query: (id) => `/domains/${id}`,
      providesTags: (result, error, id) => [{ type: "Domain", id }],
    }),

    addDomain: builder.mutation({
      query: (domainData) => ({
        url: "/domains",
        method: "POST",
        body: domainData,
      }),
      invalidatesTags: [{ type: "Domain", id: "LIST" }],
    }),

    verifyDomainDns: builder.mutation({
      query: (domainId) => ({
        url: `/domains/${domainId}/verify-dns`,
        method: "POST",
      }),
      invalidatesTags: (result, error, domainId) => [
        { type: "Domain", id: domainId },
      ],
    }),

    updateWarmupSchedule: builder.mutation({
      query: ({ domainId, ...warmupSettings }) => ({
        url: `/domains/${domainId}/warmup`,
        method: "PUT",
        body: warmupSettings,
      }),
      invalidatesTags: (result, error, { domainId }) => [
        { type: "Domain", id: domainId },
        { type: "Deliverability", id: `WARMUP_${domainId}` },
      ],
    }),
  }),
});

export const {
  useGetDomainsQuery,
  useGetDomainByIdQuery,
  useAddDomainMutation,
  useVerifyDomainDnsMutation,
  useUpdateWarmupScheduleMutation,
} = domainsApi;
