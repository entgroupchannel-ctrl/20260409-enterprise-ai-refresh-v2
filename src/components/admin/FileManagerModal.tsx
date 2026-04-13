import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, Eye, Download, Image as ImageIcon, FileText, Paperclip, Loader2 } from 'lucide-react';

interface ProductFile {
  id: string;
  product_id: string;
  file_type: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  title: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: { id: string; model: string; sku: string } | null;
}

export default function FileManagerModal({ open, onOpenChange, product }: Props) {
  const [files, setFiles] = useState<{ images: ProductFile[]; datasheets: ProductFile[]; documents: ProductFile[] }>({
    images: [], datasheets: [], documents: [],
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const imgInputRef = useRef<HTMLInputElement>(null);
  const dsInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product && open) loadFiles();
  }, [product, open]);

  const loadFiles = async () => {
    if (!product) return;
    const { data, error } = await supabase
      .from('product_files' as any)
      .select('*')
      .eq('product_id', product.id)
      .order('display_order');

    if (!error && data) {
      const all = data as unknown as ProductFile[];
      setFiles({
        images: all.filter(f => f.file_type === 'image'),
        datasheets: all.filter(f => f.file_type === 'datasheet'),
        documents: all.filter(f => f.file_type === 'document'),
      });
    }
  };

  // ⭐ Sync product_files → products.image_url + gallery_urls
  const syncImagesToProduct = async () => {
    if (!product) return;
    try {
      const { data: imageFiles } = await (supabase as any)
        .from('product_files')
        .select('file_url, is_primary, display_order, created_at')
        .eq('product_id', product.id)
        .eq('file_type', 'image')
        .order('is_primary', { ascending: false })
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (!imageFiles || imageFiles.length === 0) {
        await (supabase as any).from('products').update({
          image_url: null,
          thumbnail_url: null,
          gallery_urls: [],
        }).eq('id', product.id);
        return;
      }

      const primary = imageFiles.find((f: any) => f.is_primary) || imageFiles[0];
      const galleryUrls = imageFiles.map((f: any) => f.file_url);

      await (supabase as any).from('products').update({
        image_url: primary.file_url,
        thumbnail_url: primary.file_url,
        gallery_urls: galleryUrls,
      }).eq('id', product.id);
    } catch (e) {
      console.error('syncImagesToProduct error:', e);
    }
  };

  const handleUpload = async (fileList: FileList | null, type: string) => {
    if (!fileList || !product) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const ext = file.name.split('.').pop();
        const fileName = `${product.sku}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const filePath = `${type}s/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('product_files' as any)
          .insert({
            product_id: product.id,
            file_type: type,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
          } as any);
        if (dbError) throw dbError;
      }

      // Sync to products table if image
      if (type === 'image') {
        await syncImagesToProduct();
      }

      toast({ title: 'อัปโหลดสำเร็จ' });
      loadFiles();
    } catch (error: any) {
      toast({ title: 'อัปโหลดล้มเหลว', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file: ProductFile) => {
    if (!confirm(`ลบไฟล์นี้? (${file.file_name})`)) return;
    try {
      // 1. Delete from storage
      const url = new URL(file.file_url);
      const pathMatch = url.pathname.match(/\/product-images\/(.+)$/);
      if (pathMatch) {
        await supabase.storage.from('product-images').remove([pathMatch[1]]);
      }

      // 2. Delete from DB
      const { error } = await supabase.from('product_files' as any).delete().eq('id', file.id);
      if (error) throw error;

      // 3. Sync to products table if image
      if (file.file_type === 'image') {
        await syncImagesToProduct();
      }

      toast({ title: '✅ ลบสำเร็จ' });
      loadFiles();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const handleSetPrimary = async (file: ProductFile) => {
    if (!product) return;
    try {
      // Clear is_primary for all images of this product
      await (supabase as any)
        .from('product_files')
        .update({ is_primary: false })
        .eq('product_id', product.id)
        .eq('file_type', 'image');

      // Set this one as primary
      const { error } = await (supabase as any)
        .from('product_files')
        .update({ is_primary: true })
        .eq('id', file.id);
      if (error) throw error;

      await syncImagesToProduct();
      toast({ title: '✅ ตั้งเป็นรูปหลักแล้ว' });
      loadFiles();
    } catch (e: any) {
      toast({ title: 'ตั้งไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const handleMove = async (file: ProductFile, direction: 'up' | 'down') => {
    if (!product) return;
    const imageList = files.images;
    const index = imageList.findIndex(f => f.id === file.id);
    if (index < 0) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= imageList.length) return;

    const other = imageList[swapIndex];
    const thisOrder = file.display_order ?? index;
    const otherOrder = other.display_order ?? swapIndex;

    try {
      await (supabase as any).from('product_files').update({ display_order: otherOrder }).eq('id', file.id);
      await (supabase as any).from('product_files').update({ display_order: thisOrder }).eq('id', other.id);
      await syncImagesToProduct();
      loadFiles();
    } catch (e: any) {
      toast({ title: 'ย้ายไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paperclip className="w-5 h-5" />
            จัดการไฟล์ — {product?.model}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="images">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="images">📸 รูปภาพ ({files.images.length})</TabsTrigger>
            <TabsTrigger value="datasheets">📄 Datasheet ({files.datasheets.length})</TabsTrigger>
            <TabsTrigger value="documents">📎 เอกสาร ({files.documents.length})</TabsTrigger>
          </TabsList>

          {/* Images */}
          <TabsContent value="images" className="space-y-4 mt-4">
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files, 'image')}
            />

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.images.map((f, idx) => (
                <div key={f.id} className="group relative aspect-square rounded-lg overflow-hidden border-2 bg-muted hover:border-primary transition-colors">
                  <img
                    src={f.file_url}
                    alt={f.file_name}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary badge */}
                  {f.is_primary && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 rounded font-semibold">
                      ⭐ หลัก
                    </div>
                  )}

                  {/* Action overlay (show on hover) */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                    {!f.is_primary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-xs w-full"
                        onClick={() => handleSetPrimary(f)}
                      >
                        ⭐ ตั้งเป็นรูปหลัก
                      </Button>
                    )}

                    <div className="flex gap-1 w-full">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 flex-1 text-xs"
                        disabled={idx === 0}
                        onClick={() => handleMove(f, 'up')}
                        title="ย้ายขึ้น"
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 flex-1 text-xs"
                        disabled={idx === files.images.length - 1}
                        onClick={() => handleMove(f, 'down')}
                        title="ย้ายลง"
                      >
                        ↓
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs w-full"
                      onClick={() => handleDelete(f)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      ลบ
                    </Button>
                  </div>
                </div>
              ))}

              {/* Upload placeholder */}
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">เพิ่มรูป</span>
                  </>
                )}
              </button>
            </div>

            {files.images.length === 0 && !uploading && (
              <p className="text-center text-sm text-muted-foreground py-4">
                ยังไม่มีรูปภาพ — คลิก "เพิ่มรูป" เพื่ออัปโหลด
              </p>
            )}
          </TabsContent>

          {/* Datasheets */}
          <TabsContent value="datasheets" className="space-y-3 mt-4">
            <input ref={dsInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleUpload(e.target.files, 'datasheet')} />
            {files.datasheets.map((f) => (
              <FileRow key={f.id} file={f} onDelete={() => handleDelete(f)} formatSize={formatSize} />
            ))}
            <button
              onClick={() => dsInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
            >
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">อัปโหลด Datasheet (PDF)</span>
                </>
              )}
            </button>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-3 mt-4">
            <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={(e) => handleUpload(e.target.files, 'document')} />
            {files.documents.map((f) => (
              <FileRow key={f.id} file={f} onDelete={() => handleDelete(f)} formatSize={formatSize} />
            ))}
            <button
              onClick={() => docInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
            >
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">อัปโหลดเอกสาร</span>
                </>
              )}
            </button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function FileRow({ file, onDelete, formatSize }: { file: ProductFile; onDelete: () => void; formatSize: (b: number | null) => string }) {
  return (
    <div className="border rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-destructive" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{file.file_name}</p>
          <p className="text-xs text-muted-foreground">{formatSize(file.file_size)}</p>
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <Button size="sm" variant="outline" asChild>
          <a href={file.file_url} target="_blank" rel="noopener"><Eye className="w-3.5 h-3.5" /></a>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a href={file.file_url} download><Download className="w-3.5 h-3.5" /></a>
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
