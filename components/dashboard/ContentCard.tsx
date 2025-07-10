"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, Play, Share2 } from "lucide-react"
import Image from "next/image"
import type { ContentItem, NewsArticle } from "@/lib/types"
import { useDispatch, useSelector } from "react-redux"
import { addFavorite, removeFavorite } from "@/lib/slices/favoritesSlice"
import type { RootState } from "@/lib/store"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import type { FavoriteItem } from "@/lib/types" // Declare the FavoriteItem variable

interface ContentCardProps {
  item: ContentItem
  isDraggable?: boolean
}

export default function ContentCard({ item, isDraggable = false }: ContentCardProps) {
  const dispatch = useDispatch()
  const favorites = useSelector((state: RootState) => state.favorites.items)
  const itemId = (item as any).id?.toString() || item.title // Use ID if available, otherwise title as fallback ID
  const isFavorite = favorites.some((fav) => fav.id === itemId && fav.type === item.type)

  const handleToggleFavorite = () => {
    const favoriteItem: FavoriteItem = {
      id: itemId,
      type: item.type,
      title: item.title,
      imageUrl: getImageUrl(),
      url: "url" in item ? item.url : undefined,
    }

    if (isFavorite) {
      dispatch(removeFavorite({ id: favoriteItem.id, type: favoriteItem.type }))
    } else {
      dispatch(addFavorite(favoriteItem))
    }
  }

  const getImageUrl = () => {
    if ("urlToImage" in item && item.urlToImage) {
      return item.urlToImage
    }
    if ("poster_path" in item && item.poster_path) {
      return `https://image.tmdb.org/t/p/w500${item.poster_path}`
    }
    return "/placeholder.svg" // Default placeholder
  }

  const getDescription = () => {
    if ("description" in item && item.description) {
      return item.description
    }
    if ("overview" in item && item.overview) {
      return item.overview
    }
    if ("content" in item && item.content) {
      return item.content
    }
    return "No description available."
  }

  const getActionButtons = () => {
    if (item.type === "news") {
      return (
        <Button variant="outline" size="sm" asChild>
          <a href={(item as NewsArticle).url} target="_blank" rel="noopener noreferrer">
            Read More <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      )
    } else if (item.type === "movie") {
      return (
        <Button variant="outline" size="sm" onClick={() => alert(`Playing movie: ${item.title}`)}>
          Play Now <Play className="ml-2 h-4 w-4" />
        </Button>
      )
    } else if (item.type === "social") {
      return (
        <Button variant="outline" size="sm">
          Share <Share2 className="ml-2 h-4 w-4" />
        </Button>
      )
    }
    return null
  }

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: itemId }) // Use the consistent itemId for dnd-kit

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={isDraggable ? setNodeRef : null}
      style={isDraggable ? style : undefined}
      {...(isDraggable ? attributes : {})}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <Image
              src={getImageUrl() || "/placeholder.svg"}
              alt={item.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-4">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite} className="ml-2 shrink-0">
              <Heart className={isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
            </Button>
          </div>
          <CardDescription className="text-sm line-clamp-3 flex-grow">{getDescription()}</CardDescription>
          <div className="mt-4 flex justify-between items-center">
            {getActionButtons()}
            {isDraggable && (
              <Button variant="ghost" size="icon" {...listeners} className="cursor-grab">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-grip-vertical"
                >
                  <path d="M9 6h.01" />
                  <path d="M9 12h.01" />
                  <path d="M9 18h.01" />
                  <path d="M15 6h.01" />
                  <path d="M15 12h.01" />
                  <path d="M15 18h.01" />
                </svg>
                <span className="sr-only">Drag to reorder</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
