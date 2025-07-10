import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { NewsArticle } from "@/lib/types"

// Use NEXT_PUBLIC for client-side access to environment variables.
// In a real app, this key would be used server-side only via the API route.
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "9e7df380a9d6481c876ba12ec7e35101"

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/news" }), // Proxy through Next.js API route
  endpoints: (builder) => ({
    getNews: builder.query<
      { articles: NewsArticle[] },
      { categories: string[]; page: number; pageSize: number; query?: string }
    >({
      query: ({ categories, page, pageSize, query }) => {
        const params = new URLSearchParams()
        params.append("categories", categories.join(","))
        params.append("page", page.toString())
        params.append("pageSize", pageSize.toString())
        if (query) {
          params.append("q", query)
        }
        return `?${params.toString()}`
      },
      // Custom serialization and merging for infinite scrolling
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Only serialize based on categories and query for caching, ignore page for base cache key
        return `${endpointName}-${queryArgs.categories.join(",")}-${queryArgs.query || ""}`
      },
      merge: (currentCache, newItems, otherArgs) => {
        // Append new items to the existing cache if it's not the first page
        if (otherArgs.arg.page > 1) {
          currentCache.articles.push(...newItems.articles)
        } else {
          // For the first page, replace the cache
          return newItems
        }
      },
      // Force refetch if categories or query change, or if it's a new page
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.categories.join(",") !== previousArg?.categories.join(",") ||
          currentArg?.query !== previousArg?.query ||
          currentArg?.page > (previousArg?.page || 0)
        )
      },
    }),
  }),
})

export const { useGetNewsQuery } = newsApi
