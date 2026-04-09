import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, User } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import ShareButtons from "@/components/ShareButtons";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="บทความเทคนิค | Blog — ENT Group">
        description="บทความให้ความรู้เกี่ยวกับ Industrial IoT, Panel PC, Rugged Tablet และเทคโนโลยีสำหรับโรงงานอุตสาหกรรม">
        path="/blog"
      />

      <PageBanner
        title="บทความเทคนิค">
        subtitle="เรื่องเล่าจากประสบการณ์จริง เคล็ดลับจากทีมวิศวกร เพื่อช่วยคุณตัดสินใจเลือกเทคโนโลยีที่เหมาะสม">
        image="/images/unsplash/1504868584819-f8e8b4_w1200.jpg"
      />




      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/30 flex flex-col">
              <Link to={`/blog/${post.id}`}>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    loading="lazy"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs">
                    {post.category}
                  </Badge>
                </div>
              </Link>
              <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
                <Link to={`/blog/${post.id}`}>

                  <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}

                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {post.author}

                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
                <div className="flex-1" />
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Link to={`/blog/${post.id}`} className="flex items-center text-sm text-primary font-medium hover:underline">
                    อ่านต่อ <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <ShareButtons
                    url={`https://ent-vision.lovable.app/blog/${post.id}`}
                    title={post.title}

                    compact
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

