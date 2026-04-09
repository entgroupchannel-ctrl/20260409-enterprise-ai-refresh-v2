import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Heart,
  Share2,
  Edit,
  Save,
  X,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Upload,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface Product {
  id: string;
  product_code: string | null;
  sku: string;
  model: string;
  series: string;
  name: string;
  description: string | null;
  category: string | null;
  cpu: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  has_wifi: boolean;
  has_4g: boolean;
  os: string | null;
  unit_price: number;
  unit_price_vat: number | null;
  is_active: boolean;
  stock_status: string;
  slug: string;
  image_url: string | null;
  thumbnail_url: string | null;
  tags: string[] | null;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  const isAdmin = profile?.role === 'admin' || profile?.role === 'sales';

  useEffect(() => {
    if (slug) loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug!)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProduct(data as unknown as Product);
        setEditedProduct(data as unknown as Product);
      }
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProduct(product!);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct(product!);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { id, ...updateData } = editedProduct as Product;
      const { error } = await supabase
        .from('products')
        .update({
          name: updateData.name,
          model: updateData.model,
          description: updateData.description,
          cpu: updateData.cpu,
          ram_gb: updateData.ram_gb,
          storage_gb: updateData.storage_gb,
          storage_type: updateData.storage_type,
          has_wifi: updateData.has_wifi,
          has_4g: updateData.has_4g,
          os: updateData.os,
          unit_price: updateData.unit_price,
          unit_price_vat: updateData.unit_price_vat,
          is_active: updateData.is_active,
          stock_status: updateData.stock_status,
        })
        .eq('id', product!.id);

      if (error) throw error;

      toast({ title: 'บันทึกสำเร็จ', description: 'อัปเดตข้อมูลสินค้าเรียบร้อย' });
      setProduct({ ...product!, ...editedProduct });
      setIsEditing(false);
      loadProduct();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  const handleAddToQuote = () => {
    navigate(`/request-quote?product=${product?.model}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h2 className="text-xl font-semibold mb-2">ไม่พบสินค้า</h2>
          <p className="text-muted-foreground mb-4">ไม่พบสินค้าที่คุณค้นหา</p>
          <Button onClick={() => navigate('/gt-series')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้ารายการ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} - ${product.name} | ENT Group`}
        description={product.description?.slice(0, 160) || `${product.model} ${product.series} - สินค้าอุตสาหกรรม`}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => navigate('/')} className="hover:text-foreground">
                หน้าแรก
              </button>
              <span>/</span>
              <button onClick={() => navigate('/gt-series')} className="hover:text-foreground">
                {product.series}
              </button>
              <span>/</span>
              <span className="text-foreground font-medium">{product.model}</span>
            </div>

            {isAdmin && !isEditing && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                แก้ไข
              </Button>
            )}

            {isAdmin && isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  ยกเลิก
                </Button>
                <Button onClick={handleSave} disabled={saving} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>

        {isEditing && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm font-medium text-amber-600">
              🔧 โหมดแก้ไข - กรุณาแก้ไขข้อมูลและกดบันทึก
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-8">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.model}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="w-48 h-48 text-primary/20" />
                  )}

                  {isAdmin && isEditing && (
                    <Button className="absolute bottom-4 right-4" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      อัปโหลดรูป
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.has_wifi && (
                <Badge variant="secondary">
                  <Wifi className="w-3 h-3 mr-1" />
                  WiFi
                </Badge>
              )}
              {product.has_4g && (
                <Badge variant="secondary">
                  <Zap className="w-3 h-3 mr-1" />
                  4G
                </Badge>
              )}
              {product.tags?.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Model & Name */}
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label>รุ่น</Label>
                  <Input
                    value={editedProduct.model || ''}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="text-3xl font-bold h-auto py-2"
                  />
                </div>
                <div>
                  <Label>ชื่อสินค้า</Label>
                  <Input
                    value={editedProduct.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.model}</h1>
                <p className="text-lg text-muted-foreground">{product.name}</p>
              </div>
            )}

            {/* Price */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ราคา (ไม่รวม VAT)</Label>
                      <Input
                        type="number"
                        value={editedProduct.unit_price || 0}
                        onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value))}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <div>
                      <Label>ราคา (รวม VAT)</Label>
                      <Input
                        type="number"
                        value={editedProduct.unit_price_vat || 0}
                        onChange={(e) => handleInputChange('unit_price_vat', parseFloat(e.target.value))}
                        className="text-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">ราคาเริ่มต้น</p>
                      <p className="text-4xl font-bold text-primary">
                        ฿{product.unit_price?.toLocaleString()}
                      </p>
                    </div>
                    {product.unit_price_vat && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">รวม VAT</p>
                        <p className="text-lg font-semibold">
                          ฿{product.unit_price_vat.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Specs */}
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CPU</Label>
                  <Input
                    value={editedProduct.cpu || ''}
                    onChange={(e) => handleInputChange('cpu', e.target.value)}
                  />
                </div>
                <div>
                  <Label>RAM (GB)</Label>
                  <Input
                    type="number"
                    value={editedProduct.ram_gb || ''}
                    onChange={(e) => handleInputChange('ram_gb', parseInt(e.target.value) || null)}
                  />
                </div>
                <div>
                  <Label>Storage (GB)</Label>
                  <Input
                    type="number"
                    value={editedProduct.storage_gb || ''}
                    onChange={(e) => handleInputChange('storage_gb', parseInt(e.target.value) || null)}
                  />
                </div>
                <div>
                  <Label>Storage Type</Label>
                  <Select
                    value={editedProduct.storage_type || ''}
                    onValueChange={(value) => handleInputChange('storage_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SSD">SSD</SelectItem>
                      <SelectItem value="HDD">HDD</SelectItem>
                      <SelectItem value="MSATA">MSATA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedProduct.has_wifi || false}
                    onCheckedChange={(checked) => handleInputChange('has_wifi', checked)}
                  />
                  <Label>WiFi</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedProduct.has_4g || false}
                    onCheckedChange={(checked) => handleInputChange('has_4g', checked)}
                  />
                  <Label>4G</Label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {product.cpu && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Cpu className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">CPU</p>
                      <p className="font-medium text-sm">{product.cpu}</p>
                    </div>
                  </div>
                )}
                {product.ram_gb && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <HardDrive className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">RAM</p>
                      <p className="font-medium text-sm">{product.ram_gb} GB</p>
                    </div>
                  </div>
                )}
                {product.storage_gb && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <HardDrive className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Storage</p>
                      <p className="font-medium text-sm">
                        {product.storage_gb} GB {product.storage_type}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {!isEditing && (
              <>
                <div className="flex gap-3">
                  <Button onClick={handleAddToQuote} size="lg" className="flex-1">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    ขอใบเสนอราคา
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    product.stock_status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-muted-foreground">
                    {product.stock_status === 'available' ? 'พร้อมส่ง' : 'สอบถามสต๊อก'}
                  </span>
                </div>
              </>
            )}

            {/* Admin Controls */}
            {isAdmin && isEditing && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label>สถานะสินค้า</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Switch
                      checked={editedProduct.is_active || false}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <span>{editedProduct.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                  </div>
                </div>
                <div>
                  <Label>สถานะสต๊อก</Label>
                  <Select
                    value={editedProduct.stock_status || ''}
                    onValueChange={(value) => handleInputChange('stock_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">พร้อมส่ง</SelectItem>
                      <SelectItem value="low_stock">สต๊อกต่ำ</SelectItem>
                      <SelectItem value="out_of_stock">สินค้าหมด</SelectItem>
                      <SelectItem value="discontinued">ยกเลิกการผลิต</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-8">
          <TabsList>
            <TabsTrigger value="description">รายละเอียด</TabsTrigger>
            <TabsTrigger value="specs">ข้อมูลจำเพาะ</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {isEditing ? (
                  <div>
                    <Label>รายละเอียดสินค้า</Label>
                    <Textarea
                      value={editedProduct.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={10}
                      className="mt-2"
                    />
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line">
                      {product.description || 'ไม่มีรายละเอียด'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">ข้อมูลจำเพาะทางเทคนิค</h3>
                <div className="space-y-3">
                  {[
                    { label: 'รุ่น', value: product.model },
                    { label: 'SKU', value: product.sku },
                    { label: 'Product Code', value: product.product_code },
                    { label: 'Series', value: product.series },
                    { label: 'Category', value: product.category },
                    { label: 'CPU', value: product.cpu },
                    { label: 'RAM', value: product.ram_gb ? `${product.ram_gb} GB` : '-' },
                    { label: 'Storage', value: product.storage_gb ? `${product.storage_gb} GB ${product.storage_type}` : '-' },
                    { label: 'WiFi', value: product.has_wifi ? 'Yes' : 'No' },
                    { label: '4G', value: product.has_4g ? 'Yes' : 'No' },
                    { label: 'OS', value: product.os || '-' },
                  ].map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value || '-'}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
