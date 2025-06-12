import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';

export default async function BlogListPage() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
      <ul className="space-y-6">
        {posts.map(({ slug, date, title, excerpt }) => (
          <li key={slug} className="border-b pb-4">
            <Link href={`/Blog/${slug}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">{title}</h2>
            </Link>
            <p className="text-sm text-gray-400">{date}</p>
            <p className="mt-2 text-gray-600">{excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}