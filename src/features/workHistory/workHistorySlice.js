import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// ✅ Async thunk to save work history entries
export const saveWorkHistory = createAsyncThunk(
  "workHistory/saveWorkHistory",
  async (entries, { rejectWithValue }) => {
    try {
      const results = [];
      for (const item of entries) {
        const response = await axiosInstance.post("/api/cv-builder/work-history/", {
          userId: item.userId,
          jobTitle: item.jobTitle,
          companyName: item.companyName,
          responsibilities: item.responsibilities,
          startDate: item.startDate,
          endDate: item.endDate || null,
        });
        results.push(response.data);
      }
      return results;
    } catch (err) {
      console.error("Work history save error:", err);
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: "Failed to save work history" });
    }
  }
);

// ✅ Async thunk to delete a work history entry
export const deleteWorkHistory = createAsyncThunk(
  "workHistory/deleteWorkHistory",
  async ({ userId, entryId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/cv-builder/work-history/${userId}/${entryId}`);
      return entryId;
    } catch (err) {
      console.error("Work history delete error:", err);
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: "Failed to delete work history" });
    }
  }
);

const workHistorySlice = createSlice({
  name: "workHistory",
  initialState: {
    entries: [],
    loading: false,
    deleteLoading: false,
    error: null,
    dataLoaded: false,
  },
  reducers: {
    // Add a local entry (before saving to API)
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
    // Remove a local entry by index
    removeEntryByIndex: (state, action) => {
      state.entries = state.entries.filter((_, i) => i !== action.payload);
    },
    // Load existing entries from cvData (edit mode)
    loadExistingEntries: (state, action) => {
      if (!state.dataLoaded) {
        state.entries = action.payload;
        state.dataLoaded = true;
      }
    },
    // Clear all entries
    clearEntries: (state) => {
      state.entries = [];
      state.dataLoaded = false;
      state.error = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save work history
      .addCase(saveWorkHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveWorkHistory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveWorkHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { error: "Save failed" };
      })
      // Delete work history
      .addCase(deleteWorkHistory.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteWorkHistory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove the deleted entry by its id
        state.entries = state.entries.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteWorkHistory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || { error: "Delete failed" };
      });
  },
});

export const {
  addEntry,
  removeEntryByIndex,
  loadExistingEntries,
  clearEntries,
  clearError,
} = workHistorySlice.actions;

export default workHistorySlice.reducer;
