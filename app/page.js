import client from "../lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";

// Fetch posts from Hygraph
async function getPosts() {
  const { data } = await client.query({
    query: gql`
      query {
        blogPosts(orderBy: date_DESC) {
          title
          slug
          date
          author
          featuredImage {
            url
          }
          content {
            html
          }
        }
      }
    `,
  });
  return data.blogPosts;
}

// Decode HTML entities and strip tags for excerpt
function decodeHtml(html) {
  if (!html) return "";
  const txt = html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  // Remove all HTML tags for a clean excerpt
  return txt.replace(/(<([^>]+)>)/gi, "").slice(0, 140) + "...";
}

// Format date nicely
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Home() {
  const posts = await getPosts();
  console.log(posts.featuredImage?.url)
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold mb-12 text-center">My Blog</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Featured Image or placeholder */}
            <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
              {post.featuredImage?.url ? (
                <Image
                  src={post.featuredImage.url}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>

            {/* Card content */}
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {formatDate(post.date)} • {post.author}
                </p>
                <p className="text-gray-700 line-clamp-4">
                  {decodeHtml(post.content?.html)}
                </p>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium group-hover:bg-indigo-700 transition-colors">
                  Read More
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
