import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';

// Import all GT images from src/assets
import gt1000Banner from '@/assets/gt1000-banner.jpg';
import gt1000Front from '@/assets/gt1000-front.jpg';
import gt1000Hero from '@/assets/gt1000-hero.jpg';
import gt1000Product from '@/assets/gt1000-product.jpg';
import gt1000Rear from '@/assets/gt1000-rear.jpg';
import gt1000Side from '@/assets/gt1000-side.jpg';
import gt1000Top from '@/assets/gt1000-top.jpg';
import gt1000Wifi from '@/assets/gt1000-wifi.jpg';
import gt1200Product from '@/assets/gt1200-product.jpg';
import gt1400Product from '@/assets/gt1400-product.jpg';
import gt2000Banner from '@/assets/gt2000-banner.jpg';
import gt2000Product from '@/assets/gt2000-product.jpg';
import gt3000Banner from '@/assets/gt3000-banner.jpg';
import gt3000Product from '@/assets/gt3000-product.jpg';
import gt4000Banner from '@/assets/gt4000-banner.jpg';
import gt4000Product from '@/assets/gt4000-product.jpg';
import gt4500Banner from '@/assets/gt4500-banner.jpg';
import gt4500Product from '@/assets/gt4500-product.jpg';
import gt5000Banner from '@/assets/gt5000-banner.jpg';
import gt5000Product from '@/assets/gt5000-product.jpg';
import gt6000Banner from '@/assets/gt6000-banner.jpg';
import gt6000Product from '@/assets/gt6000-product.jpg';
import gt7000Banner from '@/assets/gt7000-banner.jpg';
import gt7000Product from '@/assets/gt7000-product.jpg';
import gt8000Banner from '@/assets/gt8000-banner.jpg';
import gt8000Product from '@/assets/gt8000-product.jpg';
import gt9000Banner from '@/assets/gt9000-banner.jpg';
import gt9000Product from '@/assets/gt9000-product.jpg';

interface GTImageRef {
  url: string;
  filename: string;
  label: string;
  source: 'asset' | 'public';
}

interface GTModelConfig {
  model: string;
  series: string;
  category: string;
  name: string;
  description: string;
  unit_price: number;
  gallery: GTImageRef[];
}

const GT_MODELS: GTModelConfig[] = [
  {
    model: 'GT1000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT1000 — 10.4" Fanless Industrial Panel PC',
    description: 'ARM Cortex, IP65 front, VESA mount, WiFi optional',
    unit_price: 19500,
    gallery: [
      { url: gt1000Product, filename: 'gt1000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt1000Front, filename: 'gt1000-front.jpg', label: 'ด้านหน้า', source: 'asset' },
      { url: gt1000Rear, filename: 'gt1000-rear.jpg', label: 'ด้านหลัง', source: 'asset' },
      { url: gt1000Side, filename: 'gt1000-side.jpg', label: 'ด้านข้าง', source: 'asset' },
      { url: gt1000Top, filename: 'gt1000-top.jpg', label: 'ด้านบน', source: 'asset' },
      { url: gt1000Hero, filename: 'gt1000-hero.jpg', label: 'Hero', source: 'asset' },
      { url: gt1000Banner, filename: 'gt1000-banner.jpg', label: 'Banner', source: 'asset' },
      { url: gt1000Wifi, filename: 'gt1000-wifi.jpg', label: 'WiFi version', source: 'asset' },
      { url: '/images/gt1000/ports-front.jpg', filename: 'gt1000-ports-front.jpg', label: 'Ports หน้า', source: 'public' },
      { url: '/images/gt1000/ports-rear.jpg', filename: 'gt1000-ports-rear.jpg', label: 'Ports หลัง', source: 'public' },
      { url: '/images/gt1000/product-angle1.jpg', filename: 'gt1000-angle1.jpg', label: 'มุม 1', source: 'public' },
      { url: '/images/gt1000/product-angle2.jpg', filename: 'gt1000-angle2.jpg', label: 'มุม 2', source: 'public' },
      { url: '/images/gt1000/side-view.jpg', filename: 'gt1000-side-view.jpg', label: 'Side view', source: 'public' },
      { url: '/images/gt1000/bottom-view.jpg', filename: 'gt1000-bottom.jpg', label: 'Bottom', source: 'public' },
      { url: '/images/gt1000/factory-app.avif', filename: 'gt1000-factory.avif', label: 'การใช้งานจริง', source: 'public' },
    ],
  },
  {
    model: 'GT1200', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT1200 — 12" Fanless Industrial Panel PC',
    description: 'ARM-based, 12-inch display, IP65 front',
    unit_price: 22500,
    gallery: [
      { url: gt1200Product, filename: 'gt1200-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: '/images/gt1200/main.jpg', filename: 'gt1200-main.jpg', label: 'Main', source: 'public' },
      { url: '/images/gt1200/front.jpg', filename: 'gt1200-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt1200/angle1.jpg', filename: 'gt1200-angle1.jpg', label: 'มุม 1', source: 'public' },
      { url: '/images/gt1200/angle2.jpg', filename: 'gt1200-angle2.jpg', label: 'มุม 2', source: 'public' },
      { url: '/images/gt1200/side.jpg', filename: 'gt1200-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt1200/side-view.jpg', filename: 'gt1200-side-view.jpg', label: 'Side view', source: 'public' },
      { url: '/images/gt1200/top.jpg', filename: 'gt1200-top.jpg', label: 'ด้านบน', source: 'public' },
      { url: '/images/gt1200/bottom.jpg', filename: 'gt1200-bottom.jpg', label: 'Bottom', source: 'public' },
      { url: '/images/gt1200/bottom-view.jpg', filename: 'gt1200-bottom-view.jpg', label: 'Bottom view', source: 'public' },
      { url: '/images/gt1200/ports-front.jpg', filename: 'gt1200-ports-front.jpg', label: 'Ports หน้า', source: 'public' },
      { url: '/images/gt1200/ports-rear.jpg', filename: 'gt1200-ports-rear.jpg', label: 'Ports หลัง', source: 'public' },
      { url: '/images/gt1200/ports.jpg', filename: 'gt1200-ports.jpg', label: 'Ports', source: 'public' },
      { url: '/images/gt1200/internal.jpg', filename: 'gt1200-internal.jpg', label: 'Internal', source: 'public' },
      { url: '/images/gt1200/dimension1.jpg', filename: 'gt1200-dimension1.jpg', label: 'Dimension 1', source: 'public' },
      { url: '/images/gt1200/dimension2.jpg', filename: 'gt1200-dimension2.jpg', label: 'Dimension 2', source: 'public' },
    ],
  },
  {
    model: 'GT1300', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT1300 — 13.3" Fanless Industrial Panel PC',
    description: 'ARM-based, 13.3-inch display, IP65 front',
    unit_price: 25000,
    gallery: [
      { url: '/images/gt1300/main.jpg', filename: 'gt1300-primary.jpg', label: 'หลัก', source: 'public' },
      { url: '/images/gt1300/front.jpg', filename: 'gt1300-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt1300/angle1.jpg', filename: 'gt1300-angle1.jpg', label: 'มุม 1', source: 'public' },
      { url: '/images/gt1300/angle2.jpg', filename: 'gt1300-angle2.jpg', label: 'มุม 2', source: 'public' },
      { url: '/images/gt1300/angle3.jpg', filename: 'gt1300-angle3.jpg', label: 'มุม 3', source: 'public' },
      { url: '/images/gt1300/angle4.jpg', filename: 'gt1300-angle4.jpg', label: 'มุม 4', source: 'public' },
      { url: '/images/gt1300/side.jpg', filename: 'gt1300-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt1300/top.jpg', filename: 'gt1300-top.jpg', label: 'ด้านบน', source: 'public' },
      { url: '/images/gt1300/bottom.jpg', filename: 'gt1300-bottom.jpg', label: 'Bottom', source: 'public' },
      { url: '/images/gt1300/ports1.jpg', filename: 'gt1300-ports1.jpg', label: 'Ports 1', source: 'public' },
      { url: '/images/gt1300/ports2.jpg', filename: 'gt1300-ports2.jpg', label: 'Ports 2', source: 'public' },
      { url: '/images/gt1300/ports-detail1.jpg', filename: 'gt1300-ports-detail1.jpg', label: 'Ports detail 1', source: 'public' },
      { url: '/images/gt1300/ports-detail2.jpg', filename: 'gt1300-ports-detail2.jpg', label: 'Ports detail 2', source: 'public' },
      { url: '/images/gt1300/internal.jpg', filename: 'gt1300-internal.jpg', label: 'Internal', source: 'public' },
      { url: '/images/gt1300/dimension.jpg', filename: 'gt1300-dimension.jpg', label: 'Dimension', source: 'public' },
      { url: '/images/gt1300/feature-dustproof.png', filename: 'gt1300-feature-dustproof.png', label: 'Dustproof', source: 'public' },
      { url: '/images/gt1300/feature-hdmi.png', filename: 'gt1300-feature-hdmi.png', label: 'HDMI', source: 'public' },
    ],
  },
  {
    model: 'GT1400', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT1400 — 14" Fanless Industrial Panel PC',
    description: 'ARM-based, 14-inch display',
    unit_price: 26500,
    gallery: [
      { url: gt1400Product, filename: 'gt1400-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: '/images/gt1400/main.jpg', filename: 'gt1400-main.jpg', label: 'Main', source: 'public' },
      { url: '/images/gt1400/front.jpg', filename: 'gt1400-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt1400/rear.jpg', filename: 'gt1400-rear.jpg', label: 'ด้านหลัง', source: 'public' },
      { url: '/images/gt1400/side.jpg', filename: 'gt1400-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt1400/bottom.jpg', filename: 'gt1400-bottom.jpg', label: 'Bottom', source: 'public' },
      { url: '/images/gt1400/internal.jpg', filename: 'gt1400-internal.jpg', label: 'Internal', source: 'public' },
      { url: '/images/gt1400/ports.png', filename: 'gt1400-ports.png', label: 'Ports', source: 'public' },
      { url: '/images/gt1400/dimension.png', filename: 'gt1400-dimension.png', label: 'Dimension', source: 'public' },
    ],
  },
  {
    model: 'GT2000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT2000 — 15" Industrial Panel PC',
    description: 'Intel Celeron, 15-inch, resistive/capacitive touch',
    unit_price: 32000,
    gallery: [
      { url: gt2000Product, filename: 'gt2000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt2000Banner, filename: 'gt2000-banner.jpg', label: 'Banner', source: 'asset' },
    ],
  },
  {
    model: 'GT3000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT3000 — 15.6" Industrial Panel PC',
    description: 'Intel Core i3/i5, 15.6-inch widescreen',
    unit_price: 38000,
    gallery: [
      { url: gt3000Product, filename: 'gt3000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt3000Banner, filename: 'gt3000-banner.jpg', label: 'Banner', source: 'asset' },
    ],
  },
  {
    model: 'GT4000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT4000 — 17" Industrial Panel PC',
    description: 'Intel Core i5/i7, 17-inch industrial display',
    unit_price: 45000,
    gallery: [
      { url: gt4000Product, filename: 'gt4000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt4000Banner, filename: 'gt4000-banner.jpg', label: 'Banner', source: 'asset' },
      { url: '/images/gt4000/front.jpg', filename: 'gt4000-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt4000/rear.jpg', filename: 'gt4000-rear.jpg', label: 'ด้านหลัง', source: 'public' },
      { url: '/images/gt4000/side.jpg', filename: 'gt4000-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt4000/angle.jpg', filename: 'gt4000-angle.jpg', label: 'มุม', source: 'public' },
      { url: '/images/gt4000/mainboard.jpg', filename: 'gt4000-mainboard.jpg', label: 'Mainboard', source: 'public' },
    ],
  },
  {
    model: 'GT4500', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT4500 — 17" Widescreen Industrial Panel PC',
    description: 'Intel Core series, 17-inch widescreen, multiple CPU options',
    unit_price: 48000,
    gallery: [
      { url: gt4500Product, filename: 'gt4500-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt4500Banner, filename: 'gt4500-banner.jpg', label: 'Banner', source: 'asset' },
    ],
  },
  {
    model: 'GT5000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT5000 — 19" Industrial Panel PC',
    description: 'Intel Core series, 19-inch display',
    unit_price: 55000,
    gallery: [
      { url: gt5000Product, filename: 'gt5000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt5000Banner, filename: 'gt5000-banner.jpg', label: 'Banner', source: 'asset' },
      { url: '/images/gt5000/main.jpg', filename: 'gt5000-main.jpg', label: 'Main', source: 'public' },
      { url: '/images/gt5000/front.jpg', filename: 'gt5000-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt5000/rear.jpg', filename: 'gt5000-rear.jpg', label: 'ด้านหลัง', source: 'public' },
      { url: '/images/gt5000/side.jpg', filename: 'gt5000-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt5000/angle.jpg', filename: 'gt5000-angle.jpg', label: 'มุม', source: 'public' },
      { url: '/images/gt5000/bottom.jpg', filename: 'gt5000-bottom.jpg', label: 'Bottom', source: 'public' },
      { url: '/images/gt5000/internal.jpg', filename: 'gt5000-internal.jpg', label: 'Internal', source: 'public' },
      { url: '/images/gt5000/spec.jpg', filename: 'gt5000-spec.jpg', label: 'Spec', source: 'public' },
    ],
  },
  {
    model: 'GT6000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT6000 — 21.5" Industrial Panel PC',
    description: 'Full HD, Intel Core series, 21.5-inch widescreen',
    unit_price: 65000,
    gallery: [
      { url: gt6000Product, filename: 'gt6000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt6000Banner, filename: 'gt6000-banner.jpg', label: 'Banner', source: 'asset' },
      { url: '/images/gt6000/main.jpg', filename: 'gt6000-main.jpg', label: 'Main', source: 'public' },
      { url: '/images/gt6000/front.jpg', filename: 'gt6000-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt6000/rear.jpg', filename: 'gt6000-rear.jpg', label: 'ด้านหลัง', source: 'public' },
      { url: '/images/gt6000/side1.jpg', filename: 'gt6000-side1.jpg', label: 'ด้านข้าง 1', source: 'public' },
      { url: '/images/gt6000/side2.jpg', filename: 'gt6000-side2.jpg', label: 'ด้านข้าง 2', source: 'public' },
      { url: '/images/gt6000/side3.jpg', filename: 'gt6000-side3.jpg', label: 'ด้านข้าง 3', source: 'public' },
      { url: '/images/gt6000/angle.jpg', filename: 'gt6000-angle.jpg', label: 'มุม', source: 'public' },
      { url: '/images/gt6000/top.jpg', filename: 'gt6000-top.jpg', label: 'ด้านบน', source: 'public' },
      { url: '/images/gt6000/bottom.jpg', filename: 'gt6000-bottom.jpg', label: 'Bottom', source: 'public' },
      { url: '/images/gt6000/ports1.jpg', filename: 'gt6000-ports1.jpg', label: 'Ports 1', source: 'public' },
      { url: '/images/gt6000/ports2.jpg', filename: 'gt6000-ports2.jpg', label: 'Ports 2', source: 'public' },
      { url: '/images/gt6000/internal.jpg', filename: 'gt6000-internal.jpg', label: 'Internal', source: 'public' },
      { url: '/images/gt6000/detail.jpg', filename: 'gt6000-detail.jpg', label: 'Detail', source: 'public' },
      { url: '/images/gt6000/spec-overview.jpg', filename: 'gt6000-spec-overview.jpg', label: 'Spec overview', source: 'public' },
    ],
  },
  {
    model: 'GT7000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT7000 — 24" Large Industrial Panel PC',
    description: 'Full HD, Intel Core series, 24-inch display',
    unit_price: 78000,
    gallery: [
      { url: gt7000Product, filename: 'gt7000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt7000Banner, filename: 'gt7000-banner.jpg', label: 'Banner', source: 'asset' },
      { url: '/images/gt7000/main.jpg', filename: 'gt7000-main.jpg', label: 'Main', source: 'public' },
      { url: '/images/gt7000/front.jpg', filename: 'gt7000-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt7000/rear.jpg', filename: 'gt7000-rear.jpg', label: 'ด้านหลัง', source: 'public' },
      { url: '/images/gt7000/side.jpg', filename: 'gt7000-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt7000/angle.jpg', filename: 'gt7000-angle.jpg', label: 'มุม', source: 'public' },
      { url: '/images/gt7000/detail.jpg', filename: 'gt7000-detail.jpg', label: 'Detail', source: 'public' },
      // gt7000-wix extra images
      { url: '/images/gt7000-wix/app-restaurant.jpg', filename: 'gt7000-app-restaurant.jpg', label: 'ร้านอาหาร', source: 'public' },
      { url: '/images/gt7000-wix/factory-app.jpg', filename: 'gt7000-factory-app.jpg', label: 'โรงงาน', source: 'public' },
      { url: '/images/gt7000-wix/use-case.png', filename: 'gt7000-use-case.png', label: 'Use case', source: 'public' },
      { url: '/images/gt7000-wix/compact-design.png', filename: 'gt7000-compact-design.png', label: 'Compact design', source: 'public' },
      { url: '/images/gt7000-wix/heatsink.png', filename: 'gt7000-heatsink.png', label: 'Heatsink', source: 'public' },
      { url: '/images/gt7000-wix/ports-overview.png', filename: 'gt7000-ports-overview.png', label: 'Ports overview', source: 'public' },
      { url: '/images/gt7000-wix/spec-detail.png', filename: 'gt7000-spec-detail.png', label: 'Spec detail', source: 'public' },
      { url: '/images/gt7000-wix/cost-saving.png', filename: 'gt7000-cost-saving.png', label: 'Cost saving', source: 'public' },
      { url: '/images/gt7000-wix/install1.jpg', filename: 'gt7000-install1.jpg', label: 'ติดตั้ง 1', source: 'public' },
      { url: '/images/gt7000-wix/install2.jpg', filename: 'gt7000-install2.jpg', label: 'ติดตั้ง 2', source: 'public' },
      { url: '/images/gt7000-wix/install3.jpg', filename: 'gt7000-install3.jpg', label: 'ติดตั้ง 3', source: 'public' },
      { url: '/images/gt7000-wix/install4.jpg', filename: 'gt7000-install4.jpg', label: 'ติดตั้ง 4', source: 'public' },
      { url: '/images/gt7000-wix/install5.jpg', filename: 'gt7000-install5.jpg', label: 'ติดตั้ง 5', source: 'public' },
      { url: '/images/gt7000-wix/line-promo.jpg', filename: 'gt7000-line-promo.jpg', label: 'LINE promo', source: 'public' },
    ],
  },
  {
    model: 'GT8000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT8000 — 27" Industrial Display',
    description: 'Large format 27-inch industrial panel',
    unit_price: 95000,
    gallery: [
      { url: gt8000Product, filename: 'gt8000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt8000Banner, filename: 'gt8000-banner.jpg', label: 'Banner', source: 'asset' },
      { url: '/images/gt8000/main.jpg', filename: 'gt8000-main.jpg', label: 'Main', source: 'public' },
      { url: '/images/gt8000/front.jpg', filename: 'gt8000-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt8000/side.jpg', filename: 'gt8000-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt8000/angle.jpg', filename: 'gt8000-angle.jpg', label: 'มุม', source: 'public' },
      { url: '/images/gt8000/bottom.jpg', filename: 'gt8000-bottom.jpg', label: 'Bottom', source: 'public' },
      { url: '/images/gt8000/internal.jpg', filename: 'gt8000-internal.jpg', label: 'Internal', source: 'public' },
    ],
  },
  {
    model: 'GT9000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT9000 — 32" Large Format Display',
    description: 'Flagship 32-inch industrial HMI display, Intel 10th Gen',
    unit_price: 120000,
    gallery: [
      { url: gt9000Product, filename: 'gt9000-primary.jpg', label: 'หลัก', source: 'asset' },
      { url: gt9000Banner, filename: 'gt9000-banner.jpg', label: 'Banner', source: 'asset' },
      { url: '/images/gt9000/main.jpg', filename: 'gt9000-main.jpg', label: 'Main', source: 'public' },
      { url: '/images/gt9000/front.jpg', filename: 'gt9000-front.jpg', label: 'ด้านหน้า', source: 'public' },
      { url: '/images/gt9000/side.jpg', filename: 'gt9000-side.jpg', label: 'ด้านข้าง', source: 'public' },
      { url: '/images/gt9000/angle.jpg', filename: 'gt9000-angle.jpg', label: 'มุม', source: 'public' },
      { url: '/images/gt9000/motherboard.png', filename: 'gt9000-motherboard.png', label: 'Motherboard', source: 'public' },
      { url: '/images/gt9000/spec.png', filename: 'gt9000-spec.png', label: 'Spec', source: 'public' },
    ],
  },
];

async function urlToBase64(url: string): Promise<{ base64: string; contentType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const blob = await response.blob();
  const contentType = blob.type || 'image/jpeg';

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return { base64, contentType };
}

export default function GTImagesImport() {
  const { toast } = useToast();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  const totalImages = GT_MODELS.reduce((s, m) => s + m.gallery.length, 0);

  const handleImport = async () => {
    setRunning(true);
    setLogs([]);
    setDone(false);
    setProgress(0);

    try {
      const totalSteps = GT_MODELS.length;

      for (let i = 0; i < GT_MODELS.length; i++) {
        const m = GT_MODELS[i];
        log(`📦 ${m.model} — uploading ${m.gallery.length} images...`);

        // 1. Convert all gallery images to base64, skip failures gracefully
        const images = (await Promise.all(
          m.gallery.map(async (g) => {
            try {
              const { base64, contentType } = await urlToBase64(g.url);
              return {
                filename: g.filename,
                base64Data: base64,
                contentType,
              };
            } catch (e) {
              log(`   ⚠️ Skip ${g.filename} — ${(e as Error).message}`);
              return null;
            }
          })
        )).filter((x): x is NonNullable<typeof x> => x !== null);

        if (images.length === 0) {
          log(`   ❌ No images for ${m.model}`);
          continue;
        }

        // 2. Upload via Edge Function
        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke(
          'upload-gt-images',
          { body: { images } }
        );

        if (uploadError) throw uploadError;

        const successUploads = uploadResult.results.filter((r: any) => r.url);
        log(`   ✅ Uploaded ${successUploads.length}/${m.gallery.length} images`);

        if (successUploads.length === 0) {
          log(`   ❌ Skipping ${m.model} — no images uploaded`);
          continue;
        }

        // 3. Find primary image URL
        const primaryUpload = uploadResult.results.find(
          (r: any) => r.filename === m.gallery[0].filename
        );
        const galleryUrls = successUploads.map((r: any) => r.url);

        // 4. INSERT or UPDATE product
        const { data: existing } = await (supabase as any)
          .from('products')
          .select('id')
          .eq('model', m.model)
          .maybeSingle();

        const slug = m.model.toLowerCase();
        const productPayload = {
          sku: slug,
          model: m.model,
          slug: slug,
          series: m.series,
          name: m.name,
          description: m.description,
          category: m.category,
          unit_price: m.unit_price,
          image_url: primaryUpload?.url || galleryUrls[0],
          thumbnail_url: primaryUpload?.url || galleryUrls[0],
          gallery_urls: galleryUrls,
          is_active: true,
        };

        if (existing) {
          await (supabase as any).from('products').update(productPayload).eq('id', existing.id);
          log(`   🔄 Updated ${m.model}`);
        } else {
          await (supabase as any).from('products').insert(productPayload);
          log(`   ➕ Created ${m.model}`);
        }

        setProgress(Math.round(((i + 1) / totalSteps) * 100));
      }

      log('🎉 Done! All GT Series products updated with images');
      setDone(true);
      toast({ title: '✅ Import สำเร็จ', description: `${GT_MODELS.length} models updated` });
    } catch (e: any) {
      log(`❌ Error: ${e.message}`);
      toast({ title: 'Import ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Import GT Series Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>นำเข้า {GT_MODELS.length} GT models พร้อมรูปภาพจาก src/assets + public/images เข้า Supabase Storage</p>
              <p className="mt-1">รวม {totalImages} รูปภาพ</p>
            </div>

            {/* Preview thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {GT_MODELS.map((m) => (
                <div key={m.model} className="text-center">
                  <img
                    src={m.gallery[0].url}
                    alt={m.model}
                    className="w-full aspect-square object-contain rounded border bg-muted/30"
                  />
                  <p className="text-[10px] mt-1 text-muted-foreground">{m.model} ({m.gallery.length})</p>
                </div>
              ))}
            </div>

            <Button onClick={handleImport} disabled={running || done} className="w-full">
              {running ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลัง Import...</>
              ) : done ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" />เสร็จแล้ว</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />เริ่ม Import GT Series ({GT_MODELS.length} models, {totalImages} ภาพ)</>
              )}
            </Button>

            {running && <Progress value={progress} />}

            {logs.length > 0 && (
              <div className="bg-muted/50 rounded p-3 max-h-96 overflow-y-auto font-mono text-xs space-y-0.5">
                {logs.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
