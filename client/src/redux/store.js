import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import campaignReducer from "./slices/campaignSlice";
import tenantReducer from "./slices/tenantSlice";
import { api } from "./services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    campaign: campaignReducer,
    tenant: tenantReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
