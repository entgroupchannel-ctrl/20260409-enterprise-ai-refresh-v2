import { Link } from "react-router-dom";
import { ArrowRight, Factory, Quote } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CaseStudiesSection = () => {
  const featured = caseStudies.slice(0, 3);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-3 text-primary border-primary/30">
            <Factory className="w-3.5 h-3.5 mr-1.5" /> Case Studies
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            กรณีศึกษาจากลูกค้าจริง
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            ตัวอย่างการนำ Industrial Computer ไปใช้งานจริงในหลากหลายอุตสาหกรรม
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((cs) => (
            <Link key={cs.id} to={`/case-studies/${cs.id}`}>
              <Card className="group overflow-hidden h-full hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs">
                    {cs.industry}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {cs.title}
                  </h3>
                  {cs.testimonial && (
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      <Quote className="w-3 h-3 inline mr-1 text-primary" />
                      {cs.testimonial}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-primary font-medium pt-1">
                    อ่านเพิ่มเติม <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/case-studies">
            <Button variant="outline" size="lg">
              ดูกรณีศึกษาทั้งหมด <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
