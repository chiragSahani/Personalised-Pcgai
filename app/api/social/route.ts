import { type NextRequest, NextResponse } from "next/server"
import type { SocialPost } from "@/lib/types"

// Mock data for social posts
const mockSocialPosts: SocialPost[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `social-${i + 1}`,
  author: `User${Math.floor(Math.random() * 100)}`,
  content: `This is a mock social post number ${i + 1}. It's about a random topic to fill space. #mock #social #content`,
  timestamp: new Date(Date.now() - i * 3600 * 1000).toISOString(),
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  type: "social",
}))

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "5")
  const q = searchParams.get("q") || ""

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  let filteredPosts = mockSocialPosts
  if (q) {
    filteredPosts = mockSocialPosts.filter(
      (post) =>
        post.content.toLowerCase().includes(q.toLowerCase()) || post.author.toLowerCase().includes(q.toLowerCase()),
    )
  }

  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  return NextResponse.json({ posts: paginatedPosts, total: filteredPosts.length })
}
