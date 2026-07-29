import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCampaigns, setSelectedCampaign, setLoading, setError } =
  campaignSlice.actions;
export default campaignSlice.reducer;
