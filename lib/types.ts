export interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
  type: "news"
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  type: "movie"
}

export interface SocialPost {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
  comments: number
  type: "social"
}

export type ContentItem = NewsArticle | Movie | SocialPost

export interface UserPreferences {
  categories: string[]
  darkMode: boolean
}

export interface FavoriteItem {
  id: string
  type: "news" | "movie" | "social"
  title: string
  imageUrl: string | null
  url?: string
}
