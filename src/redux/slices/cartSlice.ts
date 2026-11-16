import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartLine = { productId: string; quantity: number };

const cartSlice = createSlice({
  name: "cart",
  initialState: [] as CartLine[],
  reducers: {
    addToCart(state, action: PayloadAction<string>) {
      const line = state.find((item) => item.productId === action.payload);
      if (line) line.quantity += 1;
      else state.push({ productId: action.payload, quantity: 1 });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      return state.filter((item) => item.productId !== action.payload);
    },
    setQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const line = state.find((item) => item.productId === action.payload.productId);
      if (line) line.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart() {
      return [];
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
