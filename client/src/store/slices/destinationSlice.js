import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/destinations';

const initialState = {
  destinations: [],
  featuredDestinations: [],
  destination: null,
  loading: false,
  error: null,
  pages: 1,
  page: 1,
};

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchAll',
  async ({ keyword = '', pageNumber = '', category = '', rating = '' }, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${API_URL}?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}&rating=${rating}`
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchFeaturedDestinations = createAsyncThunk(
  'destinations/fetchFeatured',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_URL}/featured`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchDestinationById = createAsyncThunk(
  'destinations/fetchById',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const destinationSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    clearDestination: (state) => {
      state.destination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload.destinations;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredDestinations = action.payload;
      })
      .addCase(fetchDestinationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDestinationById.fulfilled, (state, action) => {
        state.loading = false;
        state.destination = action.payload;
      });
  },
});

export const { clearDestination } = destinationSlice.actions;
export default destinationSlice.reducer;
