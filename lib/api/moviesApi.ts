import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Movie } from "@/lib/types"

// Use NEXT_PUBLIC for client-side access to environment variables.
// In a real app, this key would be used server-side only via the API route.
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "4f9fe2531978a27c1a5e4cbe672fe27a"

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/movies" }), // Proxy through Next.js API route
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<{ results: Movie[]; total_pages: number }, { page: number; query?: string }>({
      query: ({ page, query }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        if (query) {
          params.append("q", query)
        }
        return `?${params.toString()}`
      },
      // Custom serialization and merging for infinite scrolling
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.query || ""}`
      },
      merge: (currentCache, newItems, otherArgs) => {
        if (otherArgs.arg.page > 1) {
          currentCache.results.push(...newItems.results)
        } else {
          return newItems
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.query !== previousArg?.query || currentArg?.page > (previousArg?.page || 0)
      },
    }),
  }),
})

export const { useGetTrendingMoviesQuery } = moviesApi
