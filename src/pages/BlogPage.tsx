import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import Tag from "@/components/Tag";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight } from "lucide-react";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const BlogPage = () => (
  <div>
    <Helmet>
      <title>Blog — EuroSafeAI</title>
      <meta name="description" content="Read the latest research updates, commentary, and publications from the EuroSafeAI team." />
    </Helmet>
    <section
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #ffffff 55%, #f5f7fb 100%)",
        padding: "9rem 0 6rem",
      }}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
        <AnimatedSection>
          <h1
            style={{
              fontSize: "clamp(1.9rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#0a1f4d",
              letterSpacing: "-0.025em",
              marginBottom: "1.4rem",
              maxWidth: "820px",
            }}
          >
            <span style={{ color: "#003399" }}>Blog</span>
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(10,31,77,0.65)",
              maxWidth: "720px",
            }}
          >
            Research updates, insights, and announcements from our team.
          </p>
        </AnimatedSection>
      </div>
    </section>

    <section className="section-alt py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-0 divide-y divide-border">
          {blogPosts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.05}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="block py-10 group"
                  onClick={() => window.scrollTo({ top: 0 })}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Tag>{post.category}</Tag>
                    <span className="font-mono text-xs text-muted-foreground">{formatDate(post.date)}</span>
                    {post.venue && (
                      <span className="font-mono text-xs text-muted-foreground">· {post.venue}</span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">
                    {post.summary}
                  </p>
                  <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
        </div>
      </div>
    </section>
  </div>
);

export default BlogPage;
