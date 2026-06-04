import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "/api";

const fetchAPI = async (url, options = {}) => {
  const { body, ...rest } = options;
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || response.statusText);
    error.data = data;
    throw error;
  }
  return data;
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      return await fetchAPI(`/comments/${postId}`, { method: "GET" });
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to load comments",
      );
    }
  },
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      return await fetchAPI(`/comments/${postId}`, {
        method: "POST",
        body: { content },
      });
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to add comment",
      );
    }
  },
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComments, clearError } = commentsSlice.actions;
export default commentsSlice.reducer;
