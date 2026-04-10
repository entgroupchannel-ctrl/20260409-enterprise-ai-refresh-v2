import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Trash2,
  ImagePlus,
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
  gallery_urls: string[] | null;
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const { error } = await supabase
        .from('products')
        .update({
          name: editedProduct.name,
          model: editedProduct.model,
          description: editedProduct.description,
          cpu: editedProduct.cpu,
          ram_gb: editedProduct.ram_gb,
          storage_gb: editedProduct.storage_gb,
          storage_type: editedProduct.storage_type,
          has_wifi: editedProduct.has_wifi,
          has_4g: editedProduct.has_4g,
          os: editedProduct.os,
          unit_price: editedProduct.unit_price,
          unit_price_vat: editedProduct.unit_price_vat,
          is_active: editedProduct.is_active,
          stock_status: editedProduct.stock_status,
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

  // Customer view (non-admin)
  if (!isAdmin) {
    return <CustomerProductView product={product} onAddToQuote={handleAddToQuote} />;
  }

  // Build gallery images list
  const galleryImages = [
    product.image_url,
    ...(product.gallery_urls || []),
  ].filter(Boolean) as string[];

  // Admin compact view — full viewport
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <SEOHead
        title={`${product.model} - ${product.name} | ENT Group`}
        description={product.description?.slice(0, 160) || `${product.model} ${product.series}`}
      />

      {/* Sticky Header */}
      <div className="border-b bg-card shrink-0">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="h-7 px-2">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-sm font-medium">{product.model}</span>
              <Badge variant={product.is_active ? 'default' : 'destructive'} className="text-[10px] h-5">
                {product.is_active ? 'Active' : 'Off'}
              </Badge>
              <Badge variant="outline" className="text-[10px] h-5">
                {product.stock_status === 'available' ? 'พร้อมส่ง' : product.stock_status}
              </Badge>
            </div>
            <div className="flex gap-1.5">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" size="sm" className="h-7 text-xs">
                  <Edit className="w-3 h-3 mr-1" />แก้ไข
                </Button>
              ) : (
                <>
                  <Button onClick={handleCancel} variant="ghost" size="sm" className="h-7 text-xs">
                    <X className="w-3 h-3 mr-1" />ยกเลิก
                  </Button>
                  <Button onClick={handleSave} disabled={saving} size="sm" className="h-7 text-xs">
                    <Save className="w-3 h-3 mr-1" />
                    {saving ? 'บันทึก...' : 'บันทึก'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mx-4 mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs font-medium text-amber-600 shrink-0">
          🔧 โหมดแก้ไข — แก้ไขข้อมูลแล้วกดบันทึก
        </div>
      )}

      {/* Main content — fill remaining height */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-[280px_1fr] gap-0 overflow-hidden">
        {/* Left: Gallery + Description */}
        <div className="border-r overflow-y-auto p-4 space-y-3">
          {/* Main image */}
          <div className="aspect-square bg-muted/30 rounded-lg border flex items-center justify-center overflow-hidden">
            {galleryImages.length > 0 ? (
              <img src={galleryImages[selectedImage] || galleryImages[0]} alt={product.model} className="w-full h-full object-contain" />
            ) : (
              <Package className="w-16 h-16 text-muted-foreground/20" />
            )}
          </div>

          {/* Thumbnail strip (3-5 images) */}
          <div className="flex gap-1.5">
            {galleryImages.length > 0 ? (
              galleryImages.slice(0, 5).map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-12 h-12 rounded border overflow-hidden shrink-0 transition-all ${selectedImage === i ? 'ring-2 ring-primary border-primary' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={url} alt={`${product.model} ${i + 1}`} className="w-full h-full object-contain" />
                </button>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded border bg-muted/20 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-muted-foreground/20" />
                </div>
              ))
            )}
            {isEditing && (
              <button className="w-12 h-12 rounded border border-dashed flex items-center justify-center shrink-0 hover:bg-muted/20 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground/40" />
              </button>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">รายละเอียด</h3>
            {isEditing ? (
              <Textarea
                value={editedProduct.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="text-xs min-h-[160px] resize-y"
                placeholder="รายละเอียดสินค้า..."
              />
            ) : (
              <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                {product.description || 'ไม่มีรายละเอียด'}
              </p>
            )}
          </div>

          {/* Tags */}
          {!isEditing && product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Tags</h3>
              <div className="flex flex-wrap gap-1">{product.tags.map(t => <Badge key={t} variant="outline" className="text-[10px] h-5">{t}</Badge>)}</div>
            </div>
          )}
        </div>

        {/* Right: All data fields */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Row 1: ข้อมูลสินค้า */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">ข้อมูลสินค้า</h3>
            {isEditing ? (
              <div className="grid grid-cols-4 gap-2">
                <div><Label className="text-[10px]">รุ่น</Label><Input value={editedProduct.model || ''} onChange={(e) => handleInputChange('model', e.target.value)} className="h-8 text-sm" /></div>
                <div className="col-span-2"><Label className="text-[10px]">ชื่อ</Label><Input value={editedProduct.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-[10px]">SKU</Label><Input value={product.sku} disabled className="h-8 text-sm bg-muted" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-x-6 gap-y-1.5 text-sm">
                <InfoRow label="รุ่น" value={product.model} />
                <InfoRow label="ชื่อ" value={product.name} />
                <InfoRow label="SKU" value={product.sku} />
                <InfoRow label="Code" value={product.product_code} />
                <InfoRow label="Series" value={product.series} />
                <InfoRow label="Category" value={product.category} />
              </div>
            )}
          </div>

          <div className="border-t" />

          {/* Row 2: ราคา */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">ราคา</h3>
            {isEditing ? (
              <div className="grid grid-cols-4 gap-2">
                <div><Label className="text-[10px]">ไม่รวม VAT</Label><Input type="number" value={editedProduct.unit_price || 0} onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value))} className="h-8 text-sm" /></div>
                <div><Label className="text-[10px]">รวม VAT</Label><Input type="number" value={editedProduct.unit_price_vat || 0} onChange={(e) => handleInputChange('unit_price_vat', parseFloat(e.target.value))} className="h-8 text-sm" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-x-6 gap-y-1.5 text-sm">
                <InfoRow label="ราคา" value={`฿${product.unit_price?.toLocaleString()}`} highlight />
                <InfoRow label="รวม VAT" value={product.unit_price_vat ? `฿${product.unit_price_vat.toLocaleString()}` : '-'} />
              </div>
            )}
          </div>

          <div className="border-t" />

          {/* Row 3: สเปก */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">สเปก</h3>
            {isEditing ? (
              <div className="grid grid-cols-4 gap-2">
                <div><Label className="text-[10px]">CPU</Label><Input value={editedProduct.cpu || ''} onChange={(e) => handleInputChange('cpu', e.target.value)} className="h-8 text-sm" /></div>
                <div><Label className="text-[10px]">RAM (GB)</Label><Input type="number" value={editedProduct.ram_gb || ''} onChange={(e) => handleInputChange('ram_gb', parseInt(e.target.value) || null)} className="h-8 text-sm" /></div>
                <div><Label className="text-[10px]">Storage (GB)</Label><Input type="number" value={editedProduct.storage_gb || ''} onChange={(e) => handleInputChange('storage_gb', parseInt(e.target.value) || null)} className="h-8 text-sm" /></div>
                <div>
                  <Label className="text-[10px]">Storage Type</Label>
                  <Select value={editedProduct.storage_type || ''} onValueChange={(v) => handleInputChange('storage_type', v)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SSD">SSD</SelectItem>
                      <SelectItem value="HDD">HDD</SelectItem>
                      <SelectItem value="MSATA">MSATA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-[10px]">OS</Label><Input value={editedProduct.os || ''} onChange={(e) => handleInputChange('os', e.target.value)} className="h-8 text-sm" /></div>
                <div className="flex items-end gap-4 pb-1">
                  <div className="flex items-center gap-1.5"><Switch checked={editedProduct.has_wifi || false} onCheckedChange={(c) => handleInputChange('has_wifi', c)} /><Label className="text-xs">WiFi</Label></div>
                  <div className="flex items-center gap-1.5"><Switch checked={editedProduct.has_4g || false} onCheckedChange={(c) => handleInputChange('has_4g', c)} /><Label className="text-xs">4G</Label></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-x-6 gap-y-1.5 text-sm">
                <InfoRow label="CPU" value={product.cpu} />
                <InfoRow label="RAM" value={product.ram_gb ? `${product.ram_gb} GB` : null} />
                <InfoRow label="Storage" value={product.storage_gb ? `${product.storage_gb} GB ${product.storage_type || ''}` : null} />
                <InfoRow label="OS" value={product.os} />
                <InfoRow label="WiFi" value={product.has_wifi ? '✓' : '✗'} />
                <InfoRow label="4G" value={product.has_4g ? '✓' : '✗'} />
              </div>
            )}
          </div>

          {/* Row 4: สถานะ (edit only) */}
          {isEditing && (
            <>
              <div className="border-t" />
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">สถานะ</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={editedProduct.is_active || false} onCheckedChange={(c) => handleInputChange('is_active', c)} />
                    <Label className="text-xs">{editedProduct.is_active ? 'เปิด' : 'ปิด'}</Label>
                  </div>
                  <div>
                    <Label className="text-[10px]">สถานะสต๊อก</Label>
                    <Select value={editedProduct.stock_status || ''} onValueChange={(v) => handleInputChange('stock_status', v)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">พร้อมส่ง</SelectItem>
                        <SelectItem value="low_stock">สต๊อกต่ำ</SelectItem>
                        <SelectItem value="out_of_stock">สินค้าหมด</SelectItem>
                        <SelectItem value="discontinued">ยกเลิกการผลิต</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helper ── */
function InfoRow({ label, value, highlight }: { label: string; value: string | null | undefined; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground shrink-0 w-24">{label}</span>
      <span className={highlight ? 'font-semibold text-primary' : 'font-medium'}>{value || '-'}</span>
    </div>
  );
}

/* ── Customer View (unchanged from original) ── */
function CustomerProductView({ product, onAddToQuote }: { product: Product; onAddToQuote: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} - ${product.name} | ENT Group`}
        description={product.description?.slice(0, 160) || `${product.model} ${product.series} - สินค้าอุตสาหกรรม`}
      />
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-foreground">หน้าแรก</button>
            <span>/</span>
            <button onClick={() => navigate('/gt-series')} className="hover:text-foreground">{product.series}</button>
            <span>/</span>
            <span className="text-foreground font-medium">{product.model}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />กลับ
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.model} className="w-full h-full object-contain" />
                ) : (
                  <Package className="w-48 h-48 text-primary/20" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {product.has_wifi && <Badge variant="secondary"><Wifi className="w-3 h-3 mr-1" />WiFi</Badge>}
              {product.has_4g && <Badge variant="secondary"><Zap className="w-3 h-3 mr-1" />4G</Badge>}
              {product.tags?.slice(0, 5).map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{product.model}</h1>
              <p className="text-lg text-muted-foreground">{product.name}</p>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ราคาเริ่มต้น</p>
                    <p className="text-4xl font-bold text-primary">฿{product.unit_price?.toLocaleString()}</p>
                  </div>
                  {product.unit_price_vat && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">รวม VAT</p>
                      <p className="text-lg font-semibold">฿{product.unit_price_vat.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {product.cpu && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Cpu className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">CPU</p><p className="font-medium text-sm">{product.cpu}</p></div>
                </div>
              )}
              {product.ram_gb && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <HardDrive className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">RAM</p><p className="font-medium text-sm">{product.ram_gb} GB</p></div>
                </div>
              )}
              {product.storage_gb && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <HardDrive className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="text-xs text-muted-foreground">Storage</p><p className="font-medium text-sm">{product.storage_gb} GB {product.storage_type}</p></div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={onAddToQuote} size="lg" className="flex-1">
                <ShoppingCart className="w-5 h-5 mr-2" />ขอใบเสนอราคา
              </Button>
              <Button variant="outline" size="lg"><Heart className="w-5 h-5" /></Button>
              <Button variant="outline" size="lg"><Share2 className="w-5 h-5" /></Button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${product.stock_status === 'available' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-muted-foreground">{product.stock_status === 'available' ? 'พร้อมส่ง' : 'สอบถามสต๊อก'}</span>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        {product.description && (
          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">รายละเอียด</h3>
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">ข้อมูลจำเพาะ</h3>
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
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-2 border-b last:border-b-0">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value || '-'}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
