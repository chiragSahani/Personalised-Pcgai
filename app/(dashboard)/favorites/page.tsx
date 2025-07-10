"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import type { FavoriteItem } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, Play, Share2 } from "lucide-react"
import Image from "next/image"
import { removeFavorite } from "@/lib/slices/favoritesSlice"
import { motion, AnimatePresence } from "framer-motion"

export default function FavoritesPage() {
  const dispatch = useDispatch()
  const favoriteItems = useSelector((state: RootState) => state.favorites.items)

  const handleRemoveFavorite = (id: string, type: FavoriteItem["type"]) => {
    dispatch(removeFavorite({ id, type }))
  }

  const getActionButtons = (item: FavoriteItem) => {
    if (item.type === "news") {
      return (
        <Button variant="outline" size="sm" asChild>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read More <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      )
    } else if (item.type === "movie") {
      return (
        <Button variant="outline" size="sm">
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

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Your Favorites</h1>
      {favoriteItems.length === 0 ? (
        <p className="text-center text-muted-foreground">You haven't added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {favoriteItems.map((item) => (
              <motion.div
                key={`${item.type}-${item.id}`} // Unique key for motion
                layout // Enables smooth layout transitions
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="p-0">
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFavorite(item.id, item.type)}
                        className="ml-2 shrink-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardDescription className="text-sm line-clamp-3 flex-grow">
                      {/* Favorites don't store full description, so we can show a generic message or omit */}
                      {item.type === "news" ? "News Article" : item.type === "movie" ? "Movie" : "Social Post"}
                    </CardDescription>
                    <div className="mt-4 flex justify-end items-center">{getActionButtons(item)}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
