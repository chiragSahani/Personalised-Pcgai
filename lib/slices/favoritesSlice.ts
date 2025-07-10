import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { FavoriteItem } from "@/lib/types"

interface FavoritesState {
  items: FavoriteItem[]
}

const initialState: FavoritesState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      if (!state.items.some((item) => item.id === action.payload.id && item.type === action.payload.type)) {
        state.items.push(action.payload)
      }
    },
    removeFavorite: (state, action: PayloadAction<{ id: string; type: "news" | "movie" | "social" }>) => {
      state.items = state.items.filter((item) => !(item.id === action.payload.id && item.type === action.payload.type))
    },
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
