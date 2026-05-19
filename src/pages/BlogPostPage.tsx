import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import Tag from "@/components/Tag";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, ExternalLink } from "lucide-react";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{post.title} — EuroSafeAI</title>
        <meta name="description" content={post.summary} />
      </Helmet>
      <article className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Back link */}
          <AnimatedSection>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
              onClick={() => window.scrollTo({ top: 0 })}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
          </AnimatedSection>

          {/* Header */}
          <AnimatedSection>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Tag>{post.category}</Tag>
              {post.venue && (
                <span className="font-mono text-xs text-muted-foreground">{post.venue}</span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
              {post.title}
            </h1>

            <p className="mt-6 text-muted-foreground font-mono text-sm">
              {formatDate(post.date)}
            </p>

            <p className="mt-2 text-sm text-muted-foreground italic">
              {post.authors.join(", ")}
            </p>
          </AnimatedSection>

          {/* Divider */}
          <div className="my-12 border-t border-border" />

          {/* Content */}
          <AnimatedSection delay={0.1}>
            <div className="space-y-6">
              {post.content.map((paragraph, i) => (
                <p key={i} className="text-base md:text-lg leading-relaxed text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimatedSection>

          {/* Paper link */}
          {post.paperUrl && (
            <AnimatedSection delay={0.2}>
              <div className="mt-16 pt-8 border-t border-border">
                <a
                  href={post.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                >
                  Read the full paper <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </AnimatedSection>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
