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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await fetchAPI("/auth/login", {
        method: "POST",
        body: credentials,
      });

      // Normalize response: backend returns user fields at top-level
      const user = data.user || {
        _id: data.id,
        name: data.name,
        email: data.email,
        role: data.role || "user",
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token: data.token };
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Login failed",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await fetchAPI("/auth/register", {
        method: "POST",
        body: userData,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.data?.message || error.message || "Registration failed",
      );
    }
  },
);

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") {
      return null;
    }

    const parsed = JSON.parse(user);
    if (!parsed) return null;

    if (parsed.id && !parsed._id) {
      parsed._id = parsed.id;
    }
    if (!parsed.role) {
      parsed.role = "user";
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse stored user", err);
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state /*, action */) => {
        // Registration succeeded — do not auto-login. Prompt user to login.
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
