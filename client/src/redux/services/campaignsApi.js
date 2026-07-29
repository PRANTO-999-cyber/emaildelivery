import { api } from "./api";

export const campaignsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: (params = {}) => ({
        url: "/campaigns",
        params, // { page, limit, status, search }
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Campaign", id })),
              { type: "Campaign", id: "LIST" },
            ]
          : [{ type: "Campaign", id: "LIST" }],
    }),

    getCampaignById: builder.query({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: "Campaign", id }],
    }),

    createCampaign: builder.mutation({
      query: (campaignData) => ({
        url: "/campaigns",
        method: "POST",
        body: campaignData,
      }),
      invalidatesTags: [{ type: "Campaign", id: "LIST" }],
    }),

    updateCampaign: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/campaigns/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Campaign", id },
        { type: "Campaign", id: "LIST" },
      ],
    }),

    dispatchCampaign: builder.mutation({
      query: (id) => ({
        url: `/campaigns/${id}/dispatch`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Campaign", id },
        { type: "Campaign", id: "LIST" },
        { type: "Deliverability", id: "METRICS" },
      ],
    }),

    pauseCampaign: builder.mutation({
      query: (id) => ({
        url: `/campaigns/${id}/pause`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Campaign", id }],
    }),

    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Campaign", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDispatchCampaignMutation,
  usePauseCampaignMutation,
  useDeleteCampaignMutation,
} = campaignsApi;
