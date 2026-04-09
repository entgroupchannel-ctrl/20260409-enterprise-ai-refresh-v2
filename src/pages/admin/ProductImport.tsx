import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Download, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductImport() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">นำเข้าสินค้าจาก Excel</h1>
            <p className="text-sm text-muted-foreground">Import สินค้าจำนวนมากจากไฟล์ Excel</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-10 h-10 text-primary" />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  พร้อมสำหรับการนำเข้าสินค้า GT Series
                </h2>
                <p className="text-muted-foreground">
                  ระบบฐานข้อมูลพร้อมรองรับไฟล์ Excel (1,403 สินค้า GT Series)
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <Button className="w-full" size="lg" disabled>
                  <Upload className="w-5 h-5 mr-2" />
                  เลือกไฟล์ Excel (ยังไม่พร้อมใช้งาน)
                </Button>

                <Button variant="outline" className="w-full" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  ดาวน์โหลด Template
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>หมายเหตุ:</strong> ระบบฐานข้อมูลพร้อมแล้ว<br />
                  รอเปิดใช้งานฟีเจอร์ Import ในรุ่นถัดไป
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">ขั้นตอนการนำเข้า (เมื่อพร้อม):</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>เตรียมไฟล์ Excel ตาม Template</li>
              <li>Upload ไฟล์เข้าระบบ</li>
              <li>ตรวจสอบข้อมูลก่อน Import</li>
              <li>ยืนยันการนำเข้า</li>
              <li>ระบบจะ parse specs และสร้าง SKU/slug อัตโนมัติ</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
