import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [] as string[],
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const index = state.indexOf(action.payload);
      if (index >= 0) state.splice(index, 1);
      else state.push(action.payload);
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
