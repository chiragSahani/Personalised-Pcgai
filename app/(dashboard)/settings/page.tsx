"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { setCategories } from "@/lib/slices/preferencesSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const availableCategories = ["technology", "sports", "finance", "health", "science", "entertainment", "business"]

export default function SettingsPage() {
  const dispatch = useDispatch()
  const currentCategories = useSelector((state: RootState) => state.preferences.categories)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategories)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category))
    }
  }

  const handleSavePreferences = () => {
    dispatch(setCategories(selectedCategories))
    // In a real application, you might use a toast notification here
    alert("Preferences saved!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6"
    >
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Content Preferences</CardTitle>
          <CardDescription>
            Select the categories of content you'd like to see in your personalized feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="capitalize">
                  {category}
                </Label>
              </div>
            ))}
          </div>
          <Button onClick={handleSavePreferences} className="w-fit">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
