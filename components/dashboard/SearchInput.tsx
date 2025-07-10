"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useState, useEffect } from "react"

interface SearchInputProps {
  onSearch: (query: string) => void
  initialValue?: string
}

export default function SearchInput({ onSearch, initialValue = "" }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(initialValue)
  const debouncedSearchTerm = useDebounce(inputValue, 500) // Debounce for 500ms

  useEffect(() => {
    // Only call onSearch if the debounced term is different from the initial value
    // or if it's not empty (to avoid initial empty search on mount if not desired)
    if (debouncedSearchTerm !== initialValue || debouncedSearchTerm !== "") {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch, initialValue])

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search content..."
        className="w-full rounded-lg bg-background pl-8"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  )
}
