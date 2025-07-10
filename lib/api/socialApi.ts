import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { SocialPost } from "@/lib/types"

export const socialApi = createApi({
  reducerPath: "socialApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/social" }), // Proxy through Next.js API route
  endpoints: (builder) => ({
    getSocialPosts: builder.query<{ posts: SocialPost[] }, { page: number; pageSize: number; query?: string }>({
      query: ({ page, pageSize, query }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("pageSize", pageSize.toString())
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
          currentCache.posts.push(...newItems.posts)
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

export const { useGetSocialPostsQuery } = socialApi
