import { type NextRequest, NextResponse } from "next/server"

// In a real production app, this API key should be stored securely as an environment variable
// and only accessed on the server side.
const TMDB_API_KEY = process.env.TMDB_API_KEY || "4f9fe2531978a27c1a5e4cbe672fe27a"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"
  const q = searchParams.get("q") || ""

  let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`

  if (q) {
    // If a search query is provided, use the search endpoint
    url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=${page}`
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json()
      console.error("TMDB API error:", errorData)
      // TMDB API often returns 'status_message' for errors
      return NextResponse.json(
        { error: errorData.status_message || "Failed to fetch movies" },
        { status: response.status },
      )
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
