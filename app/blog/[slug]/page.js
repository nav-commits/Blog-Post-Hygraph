import client from "../../../lib/apollo";
import { gql } from "@apollo/client";
import Image from "next/image";

async function getPost(slug) {
  try {
    const { data } = await client.query({
      query: gql`
        query ($slug: String!) {
          blogPost(where: { slug: $slug }) {
            title
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
      variables: { slug },
    });
    return data.blogPost;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    return (
      <div className="text-center mt-12">
        <p className="text-xl font-semibold">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Featured Image */}
      {post.featuredImage?.url && (
        <div className="relative w-full h-64 mb-6">
          <Image
            src={post.featuredImage.url}
            alt={post.title}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      )}

      {/* Title & Meta */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        {new Date(post.date).toLocaleDateString()} • {post.author}
      </p>

      {/* Render RichText HTML properly */}
      <div
        className="prose prose-indigo max-w-none"
        dangerouslySetInnerHTML={{
          __html: post.content?.html.replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "<p>No content yet.</p>",
        }}
      />
    </div>
  );
}
