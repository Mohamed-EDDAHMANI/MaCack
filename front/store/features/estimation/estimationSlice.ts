import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Estimation UI state only. Do not store fetched estimations here — use component state for get. */
export interface EstimationState {
  /** Order ID for which the estimation panel is open; null = closed */
  estimationPanelOrderId: string | null;
}

const initialState: EstimationState = {
  estimationPanelOrderId: null,
};

const estimationSlice = createSlice({
  name: "estimation",
  initialState,
  reducers: {
    openEstimationPanel(state, action: PayloadAction<string>) {
      state.estimationPanelOrderId = action.payload;
    },
    closeEstimationPanel(state) {
      state.estimationPanelOrderId = null;
    },
  },
});

export const { openEstimationPanel, closeEstimationPanel } =
  estimationSlice.actions;
export const estimationReducer = estimationSlice.reducer;
