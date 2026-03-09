import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toggleProfileLikeApi } from "./profileLikeApi";

export interface ProfileLikeState {
  profileLikeLoading: boolean;
  profileLikeError: string | null;
  /** patissiereId -> { liked, count } after a successful toggle. */
  statusByPatissiere: Record<string, { liked: boolean; count: number }>;
}

const initialState: ProfileLikeState = {
  profileLikeLoading: false,
  profileLikeError: null,
  statusByPatissiere: {},
};

export const toggleProfileLike = createAsyncThunk(
  "profileLike/toggleProfileLike",
  async (patissiereId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { user: { id: string } | null } };
      const userId = state.auth.user?.id ?? null;
      if (!userId) {
        return rejectWithValue("You must be logged in to like a profile");
      }
      const { liked, count } = await toggleProfileLikeApi(patissiereId, userId);
      return { patissiereId, userId, liked, count };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to toggle profile like"
      );
    }
  }
);

const profileLikeSlice = createSlice({
  name: "profileLike",
  initialState,
  reducers: {
    setProfileLikeStatus(
      state,
      action: {
        payload: {
          patissiereId: string;
          liked: boolean;
          count: number;
        };
      }
    ) {
      const { patissiereId, liked, count } = action.payload;
      state.statusByPatissiere[patissiereId] = { liked, count };
    },
    clearProfileLikeError(state) {
      state.profileLikeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleProfileLike.pending, (state) => {
        state.profileLikeLoading = true;
        state.profileLikeError = null;
      })
      .addCase(toggleProfileLike.fulfilled, (state, action) => {
        state.profileLikeLoading = false;
        const { patissiereId, liked, count } = action.payload;
        state.statusByPatissiere[patissiereId] = { liked, count };
      })
      .addCase(toggleProfileLike.rejected, (state, action) => {
        state.profileLikeLoading = false;
        state.profileLikeError = (action.payload as string) ?? "Unknown error";
      });
  },
});

export const { setProfileLikeStatus, clearProfileLikeError } =
  profileLikeSlice.actions;
export default profileLikeSlice.reducer;
