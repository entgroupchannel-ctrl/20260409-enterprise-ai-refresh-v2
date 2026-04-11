import { Sparkles, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ReviewsSection() {
  return (
    <Card className="border-border">
      <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Sparkles key={i} className="w-6 h-6 text-muted-foreground/30" />
          ))}
        </div>
        <p className="text-muted-foreground">ยังไม่มีรีวิว — เป็นคนแรกที่รีวิวสินค้านี้</p>
        <Button variant="outline" size="sm" disabled>
          <MessageSquareText className="w-4 h-4 mr-1.5" />
          เขียนรีวิว
        </Button>
        <p className="text-xs text-muted-foreground">ระบบรีวิวจะเปิดให้บริการเร็วๆ นี้</p>
      </CardContent>
    </Card>
  );
}
