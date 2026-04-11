import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheckBig, MapPinned, Timer, PackageCheck, Truck, ShieldCheck } from 'lucide-react';

const supplierInfo = {
  name: 'บริษัท อีเอ็นที กรุ๊ป จำกัด',
  verified: true,
  location: 'กรุงเทพมหานคร, ประเทศไทย',
  certifications: ['ISO 9001:2015', 'CE', 'FCC'],
  responseTime: 'ภายใน 4 ชั่วโมงทำการ',
  moq: '1 unit',
  shipping: '3-5 วันทำการ',
  warranty: '1-3 ปี',
};

export default function SupplierInfoCard() {
  return (
    <Card className="border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{supplierInfo.name}</span>
          {supplierInfo.verified && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{supplierInfo.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{supplierInfo.responseTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-primary" />
            <span>MOQ: {supplierInfo.moq}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-primary" />
            <span>{supplierInfo.shipping}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>รับประกัน {supplierInfo.warranty}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {supplierInfo.certifications.map(cert => (
            <Badge key={cert} variant="outline" className="text-[10px] font-normal">
              {cert}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
