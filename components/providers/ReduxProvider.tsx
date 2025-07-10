"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { CustomPersistGate } from "./CustomPersistGate" // Import our custom PersistGate

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* Use the custom PersistGate component */}
      <CustomPersistGate loading={null}>{children}</CustomPersistGate>
    </Provider>
  )
}
