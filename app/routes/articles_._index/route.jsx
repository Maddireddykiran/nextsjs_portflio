import { baseMeta } from '~/utils/meta';
import { getPosts } from './posts.server';
import { json } from '@remix-run/cloudflare';

export async function loader() {
  const allPosts = await getPosts();
  const featuredPosts = allPosts.filter(post => post.frontmatter.featured);
  const posts = allPosts.filter(post => !post.frontmatter.featured);

  return json({ 
    posts, 
    featuredPosts,
    featured: featuredPosts[0] 
  });
}

export function meta() {
  return baseMeta({
    title: 'Articles',
    description:
      'A collection of technical design and development articles. May contain incoherent ramblings.',
  });
}

export { Articles as default } from './articles';
