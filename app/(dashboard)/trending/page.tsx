"use client"

import { useState, useEffect, useCallback } from "react"
import { useGetNewsQuery } from "@/lib/api/newsApi"
import { useGetTrendingMoviesQuery } from "@/lib/api/moviesApi"
import { useGetSocialPostsQuery } from "@/lib/api/socialApi"
import type { ContentItem, NewsArticle, Movie, SocialPost } from "@/lib/types"
import ContentCard from "@/components/dashboard/ContentCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import SearchInput from "@/components/dashboard/SearchInput"
import { motion, AnimatePresence } from "framer-motion"

const ITEMS_PER_PAGE = 10

export default function TrendingPage() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [trendingItems, setTrendingItems] = useState<ContentItem[]>([])

  // For trending, we'll fetch general news, popular movies, and general social posts
  const {
    data: newsData,
    isLoading: isLoadingNews,
    isFetching: isFetchingNews,
    error: newsError,
  } = useGetNewsQuery({
    categories: ["general"], // Default to general for trending
    page,
    pageSize: Math.floor(ITEMS_PER_PAGE / 2),
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
    pageSize: Math.floor(ITEMS_PER_PAGE / 2),
    query: searchQuery,
  })

  const isLoading = isLoadingNews || isLoadingMovies || isLoadingSocial
  const isFetching = isFetchingNews || isFetchingMovies || isFetchingSocial
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

      const combinedNewItems = [...newNews, ...newMovies, ...newSocial].sort(() => 0.5 - Math.random())

      if (page === 1) {
        setTrendingItems(combinedNewItems)
      } else {
        setTrendingItems((prevItems) => {
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

  const handleScroll = useCallback(() => {
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

  if (newsError || moviesError || socialError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load trending content. Please check your network connection or try again later.
          {newsError && <p>News Error: {(newsError as any).message || JSON.stringify(newsError)}</p>}
          {moviesError && <p>Movies Error: {(moviesError as any).message || JSON.stringify(moviesError)}</p>}
          {socialError && <p>Social Error: {(socialError as any).message || JSON.stringify(socialError)}</p>}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Trending Content</h1>
      <SearchInput onSearch={setSearchQuery} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {trendingItems.map((item) => (
            <motion.div
              key={(item as any).id?.toString() || item.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ContentCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading &&
          Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
      </div>
      {!isLoading && !hasMore && trendingItems.length > 0 && (
        <p className="text-center text-muted-foreground mt-4">You've reached the end of trending content.</p>
      )}
      {!isLoading && trendingItems.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No trending content found for your search query.</p>
      )}
    </div>
  )
}
