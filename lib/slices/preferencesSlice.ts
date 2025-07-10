import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserPreferences } from "@/lib/types"

const initialState: UserPreferences = {
  categories: ["technology", "sports", "finance"],
  darkMode: false,
}

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
  },
})

export const { setCategories, toggleDarkMode, setDarkMode } = preferencesSlice.actions
export default preferencesSlice.reducer
