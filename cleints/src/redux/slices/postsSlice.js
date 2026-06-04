import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "/api";

const fetchAPI = async (url, options = {}) => {
  const { body, ...rest } = options;
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;
  if (isFormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...rest,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || response.statusText);
    error.data = data;
    throw error;
  }

  if (data && data.success === true && data.data !== undefined) {
    return data.data;
  }
  return data;
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAPI("/posts", { method: "GET" });
      return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to load posts",
      );
    }
  },
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchAPI(`/posts/${id}`, { method: "GET" });
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to load post",
      );
    }
  },
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      return await fetchAPI("/posts", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to create post",
      );
    }
  },
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await fetchAPI(`/posts/${id}`, {
        method: "PUT",
        body: formData,
      });
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to update post",
      );
    }
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await fetchAPI(`/posts/${id}`, { method: "DELETE" });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to delete post",
      );
    }
  },
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchAPI(`/posts/${id}/like`, { method: "PUT" });
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Failed to toggle like",
      );
    }
  },
);

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
