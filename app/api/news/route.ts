import { type NextRequest, NextResponse } from "next/server"

// In a real production app, this API key should be stored securely as an environment variable
// and only accessed on the server side.
const NEWS_API_KEY = process.env.NEWS_API_KEY || "9e7df380a9d6481c876ba12ec7e35101"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categories = searchParams.get("categories") || "general"
  const page = searchParams.get("page") || "1"
  const pageSize = searchParams.get("pageSize") || "5"
  const q = searchParams.get("q") || ""

  let url = `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&language=en&pageSize=${pageSize}&page=${page}`

  if (q) {
    // If a search query is provided, use the 'everything' endpoint
    url = `https://newsapi.org/v2/everything?apiKey=${NEWS_API_KEY}&language=en&pageSize=${pageSize}&page=${page}&q=${encodeURIComponent(q)}`
  } else {
    // For personalized feed without a search query, use 'top-headlines' with the first category
    // NewsAPI's top-headlines endpoint only supports one category at a time.
    url += `&category=${categories.split(",")[0]}`
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json()
      console.error("NewsAPI error:", errorData)
      // Return a more specific error message from the API if available
      return NextResponse.json({ error: errorData.message || "Failed to fetch news" }, { status: response.status })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
