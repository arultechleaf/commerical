import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import filterReducer from "./slices/filterSlice";
import uiReducer from "./slices/uiSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      categories: categoryReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      filters: filterReducer,
      ui: uiReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
