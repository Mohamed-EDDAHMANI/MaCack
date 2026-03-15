import { configureStore, combineReducers, type Middleware } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authReducer } from "./features/auth";
import { logout } from "./features/auth";
import { catalogReducer } from "./features/catalog";
import { followReducer } from "./features/follow";
import { profileLikeReducer } from "./features/profileLike";
import { cartReducer } from "./features/cart/cartSlice";
import { estimationReducer } from "./features/estimation";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "cart"], // persist auth + cart
};

const appReducer = combineReducers({
  auth: authReducer,
  catalog: catalogReducer,
  follow: followReducer,
  profileLike: profileLikeReducer,
  cart: cartReducer,
  estimation: estimationReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: { type: string }
) => {
  // On logout reset all slices in memory.
  if (action.type === logout.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let persistorRef: ReturnType<typeof persistStore> | null = null;

const resetPersistOnLogoutMiddleware: Middleware =
  () => (next) => (action) => {
    const result = next(action);
    // Also clear persisted storage after logout.
    if ((action as { type?: string })?.type === logout.type) {
      void persistorRef?.purge();
    }
    return result;
  };

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(resetPersistOnLogoutMiddleware),
});

export const persistor = persistStore(store);
persistorRef = persistor;

// Derive RootState from rootReducer so state.auth/state.catalog are typed;
// store.getState() can be inferred as PersistPartial only when using persistReducer.
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
