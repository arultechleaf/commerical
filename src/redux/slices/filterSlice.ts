import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Filters = { query: string; category: string; sort: string };
const filterSlice = createSlice({
  name: "filters",
  initialState: { query: "", category: "all", sort: "featured" } as Filters,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      Object.assign(state, action.payload);
    },
    resetFilters() {
      return { query: "", category: "all", sort: "featured" };
    },
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
