"use client"

import { useState, useEffect, useCallback } from "react"
import { useGetNewsQuery } from "@/lib/api/newsApi"
import { useGetTrendingMoviesQuery } from "@/lib/api/moviesApi"
import { useGetSocialPostsQuery } from "@/lib/api/socialApi"
import type { ContentItem, NewsArticle, Movie, SocialPost } from "@/lib/types"
import ContentCard from "@/components/dashboard/ContentCard"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { DndProvider } from "@/components/providers/DndProvider"
import { arrayMove } from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import SearchInput from "@/components/dashboard/SearchInput"

const ITEMS_PER_PAGE = 10 // Total items per page, split across content types

export default function PersonalizedFeedPage() {
  const { categories } = useSelector((state: RootState) => state.preferences)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [feedItems, setFeedItems] = useState<ContentItem[]>([])

  // Fetch data for different content types
  const {
    data: newsData,
    isLoading: isLoadingNews,
    isFetching: isFetchingNews,
    error: newsError,
  } = useGetNewsQuery({
    categories,
    page,
    pageSize: Math.floor(ITEMS_PER_PAGE / 2), // Allocate half for news
    query: searchQuery,
  })
  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    isFetching: isFetchingMovies,
    error: moviesError,
  } = useGetTrendingMoviesQuery({
    page,
    query: searchQuery,
  })
  const {
    data: socialData,
    isLoading: isLoadingSocial,
    isFetching: isFetchingSocial,
    error: socialError,
  } = useGetSocialPostsQuery({
    page,
    pageSize: Math.floor(ITEMS_PER_PAGE / 2), // Allocate half for social
    query: searchQuery,
  })

  const isLoading = isLoadingNews || isLoadingMovies || isLoadingSocial
  const isFetching = isFetchingNews || isFetchingMovies || isFetchingSocial

  // Determine if there's more content to load from any source
  const hasMore =
    (newsData?.articles?.length || 0) > 0 ||
    (moviesData?.results?.length || 0) > 0 ||
    (socialData?.posts?.length || 0) > 0

  useEffect(() => {
    if (newsData || moviesData || socialData) {
      const newNews: NewsArticle[] =
        newsData?.articles?.map((article) => ({ ...article, type: "news", id: article.url })) || []
      const newMovies: Movie[] = moviesData?.results?.map((movie) => ({ ...movie, type: "movie" })) || []
      const newSocial: SocialPost[] = socialData?.posts?.map((post) => ({ ...post, type: "social" })) || []

      // Combine and randomize the order of new items
      const combinedNewItems = [...newNews, ...newMovies, ...newSocial].sort(() => 0.5 - Math.random())

      if (page === 1) {
        // For the first page, replace the items
        setFeedItems(combinedNewItems)
      } else {
        // For subsequent pages, append new unique items
        setFeedItems((prevItems) => {
          const existingIds = new Set(prevItems.map((item) => (item as any).id?.toString() || item.title))
          const filteredNewItems = combinedNewItems.filter(
            (item) => !existingIds.has((item as any).id?.toString() || item.title),
          )
          return [...prevItems, ...filteredNewItems]
        })
      }
    }
  }, [newsData, moviesData, socialData, page])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [isLoading, isFetching, hasMore])

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setFeedItems((items) => {
        const oldIndex = items.findIndex((item) => ((item as any).id?.toString() || item.title) === active.id)
        const newIndex = items.findIndex((item) => ((item as any).id?.toString() || item.title) === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }, [])

  // Infinite scrolling logic
  const handleScroll = useCallback(() => {
    // Check if user has scrolled near the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
      !isLoading &&
      !isFetching &&
      hasMore
    ) {
      handleLoadMore()
    }
  }, [isLoading, isFetching, hasMore, handleLoadMore])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Display error messages if any API call fails
  if (newsError || moviesError || socialError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load content. Please check your network connection or try again later.
          {newsError && <p>News Error: {(newsError as any).message || JSON.stringify(newsError)}</p>}
          {moviesError && <p>Movies Error: {(moviesError as any).message || JSON.stringify(moviesError)}</p>}
          {socialError && <p>Social Error: {(socialError as any).message || JSON.stringify(socialError)}</p>}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Personalized Feed</h1>
      <SearchInput onSearch={setSearchQuery} />
      <DndProvider
        items={feedItems.map((item) => ({ id: (item as any).id?.toString() || item.title }))}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {feedItems.map((item) => (
              <motion.div
                key={(item as any).id?.toString() || item.title} // Unique key for motion and dnd-kit
                layout // Enables smooth layout transitions
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ContentCard item={item} isDraggable />
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading &&
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
            ))}
        </div>
      </DndProvider>
      {!isLoading && !hasMore && feedItems.length > 0 && (
        <p className="text-center text-muted-foreground mt-4">You've reached the end of the feed.</p>
      )}
      {!isLoading && feedItems.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No content found for your preferences or search query.</p>
      )}
    </div>
  )
}
