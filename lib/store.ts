import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storage from "redux-persist/lib/storage" // defaults to localStorage for web

import preferencesReducer from "@/lib/slices/preferencesSlice"
import favoritesReducer from "@/lib/slices/favoritesSlice"
import { newsApi } from "@/lib/api/newsApi"
import { moviesApi } from "@/lib/api/moviesApi"
import { socialApi } from "@/lib/api/socialApi"

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["preferences", "favorites"], // only preferences and favorites will be persisted
}

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  favorites: favoritesReducer,
  [newsApi.reducerPath]: newsApi.reducer,
  [moviesApi.reducerPath]: moviesApi.reducer,
  [socialApi.reducerPath]: socialApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(newsApi.middleware, moviesApi.middleware, socialApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
