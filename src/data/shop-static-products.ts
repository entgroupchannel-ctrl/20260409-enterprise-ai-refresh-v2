// Static shop products that don't live in the Supabase `products` table
// แต่มีหน้า /shop/:slug แยกต่างหาก (configurator-based products)
// ใช้สำหรับระบบ Compare เพื่อให้สินค้า static เหล่านี้ปรากฏในตาราง spec comparison ได้
//
// ⚠ ข้อมูลในไฟล์นี้ต้องตรงกับ staticProducts ใน src/pages/shop/ShopStorefront.tsx
//   เมื่อเพิ่มสินค้า static ใหม่ ให้เพิ่มทั้งสองที่
import gd215cHero from '@/assets/touchwo/gd215c/GD215-1A.jpg';
import gd238c3Hero from '@/assets/touchwo/gd238c/L-1.jpg';
import gd27cHero from '@/assets/touchwo/gd27c/p-1.jpg';
import dm080nfHero from '@/assets/touchwork/DM080NF-Monitor.jpg';
import dm080wgHero from '@/assets/touchwork/DM080WG-Monitor.jpg';
import dm101gHero from '@/assets/touchwork/DM101G-Monitor.jpg';
import dm104gHero from '@/assets/touchwork/DM104G-Monitor.jpg';
import dm121gHero from '@/assets/touchwork/DM121G-Monitor.jpg';
import dm15gHero from '@/assets/touchwork/DM15G-Monitor.jpg';
import dm156gHero from '@/assets/touchwork/DM156G-Monitor.jpg';
import dm17gHero from '@/assets/touchwork/DM17G-Monitor.jpg';
import dm19gHero from '@/assets/touchwork/DM19G-Monitor.jpg';
import dm215gHero from '@/assets/touchwork/DM215G-Monitor.jpg';

const gd32cHero = 'https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/product-images/touchwo/gd32c/gallery-01.jpg';

export interface ShopStaticCompareProduct {
  id: string;
  slug: string;
  model: string;
  name: string;
  thumbnail_url: string | null;
  cpu: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  has_wifi: boolean;
  has_4g: boolean;
  os: string | null;
  form_factor: string | null;
  unit_price: number;
  stock_status: string | null;
}

export const SHOP_STATIC_COMPARE_PRODUCTS: ShopStaticCompareProduct[] = [
  {
    id: 'static-gd215c',
    slug: 'gd215c',
    model: 'GD215C',
    name: 'Wall Mounting Touch Kiosk 21.5"',
    thumbnail_url: gd215cHero,
    cpu: 'RK3568 / RK3588',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC',
    has_wifi: true,
    has_4g: false,
    os: 'Android 11/12',
    form_factor: 'Wall-Mount Kiosk',
    unit_price: 36990,
    stock_status: 'available',
  },
  {
    id: 'static-gd238c3',
    slug: 'gd238c3',
    model: 'GD238C3',
    name: 'Wall Mounting Touch Kiosk 23.8" (Landscape 16:9)',
    thumbnail_url: gd238c3Hero,
    cpu: 'RK3568 / RK3588',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC',
    has_wifi: true,
    has_4g: false,
    os: 'Android 11/12',
    form_factor: 'Wall-Mount Kiosk',
    unit_price: 42990,
    stock_status: 'available',
  },
  {
    id: 'static-gd32c',
    slug: 'gd32c',
    model: 'GD32C',
    name: 'Wall Mounting Touch Kiosk 32" (Portrait 9:16, ARM)',
    thumbnail_url: gd32cHero,
    cpu: 'RK3568 / Intel Core i3-i7',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Android 11/12 / Windows 10/11',
    form_factor: 'Wall-Mount Kiosk',
    unit_price: 39990,
    stock_status: 'available',
  },
  {
    id: 'static-gd27c',
    slug: 'gd27c',
    model: 'GD27C',
    name: 'Wall Mounting Touch Kiosk 27" (Portrait, PCAP)',
    thumbnail_url: gd27cHero,
    cpu: 'RK3568 / Intel Core i3-i7',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Android 11/12 / Windows 10/11',
    form_factor: 'Wall-Mount Kiosk',
    unit_price: 34990,
    stock_status: 'available',
  },
  {
    id: 'static-dm080nf',
    slug: 'dm080nf',
    model: 'DM080NF',
    name: 'TouchWork 8" Industrial Touch PC (Monitor / Android / Windows)',
    thumbnail_url: dm080nfHero,
    cpu: 'Plug & Play / RK3568 / Intel i3-i7',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC',
    unit_price: 13990,
    stock_status: 'available',
  },
  {
    id: 'static-dm080wg',
    slug: 'dm080wg',
    model: 'DM080WG',
    name: 'TouchWork 8" Widescreen 16:10 Touch PC (Monitor / Android / Windows)',
    thumbnail_url: dm080wgHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC (Widescreen)',
    unit_price: 13990,
    stock_status: 'available',
  },
  {
    id: 'static-dm101g',
    slug: 'dm101g',
    model: 'DM101G',
    name: 'TouchWork 10.1" Industrial Touch PC 16:10 (Monitor / Android / Windows)',
    thumbnail_url: dm101gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC',
    unit_price: 13990,
    stock_status: 'available',
  },
  {
    id: 'static-dm104g',
    slug: 'dm104g',
    model: 'DM104G',
    name: 'TouchWork 10.4" Industrial Touch PC 4:3 (Monitor / Android / Windows)',
    thumbnail_url: dm104gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC',
    unit_price: 13990,
    stock_status: 'available',
  },
  {
    id: 'static-dm121g',
    slug: 'dm121g',
    model: 'DM121G',
    name: 'TouchWork 12.1" Industrial Touch PC 4:3 (Monitor / Android / Windows)',
    thumbnail_url: dm121gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC',
    unit_price: 14990,
    stock_status: 'available',
  },
  {
    id: 'static-dm15g',
    slug: 'dm15g',
    model: 'DM15G',
    name: 'TouchWork 15" Industrial Touch PC 4:3 (Monitor / Android / Windows)',
    thumbnail_url: dm15gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC',
    unit_price: 15990,
    stock_status: 'available',
  },
  {
    id: 'static-dm156g',
    slug: 'dm156g',
    model: 'DM156G',
    name: 'TouchWork 15.6" Industrial Touch PC 16:9 Full HD (Monitor / Android / Windows)',
    thumbnail_url: dm156gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC',
    unit_price: 16990,
    stock_status: 'available',
  },
  {
    id: 'static-dm17g',
    slug: 'dm17g',
    model: 'DM17G',
    name: 'TouchWork 17" Industrial Touch PC 5:4 (Monitor / Android / Windows)',
    thumbnail_url: dm17gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android / Windows',
    form_factor: 'Industrial Touch PC',
    unit_price: 15990,
    stock_status: 'available',
  },
  {
    id: 'static-dm19g',
    slug: 'dm19g',
    model: 'DM19G',
    name: 'TouchWork 19" Industrial Touch PC 5:4 (Monitor / Android / Windows)',
    thumbnail_url: dm19gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android 11-13 / Windows 10-11',
    form_factor: 'Industrial Touch PC',
    unit_price: 16990,
    stock_status: 'available',
  },
  {
    id: 'static-dm215g',
    slug: 'dm215g',
    model: 'DM215G',
    name: 'TouchWork 21.5" Industrial Touch PC 16:9 Full HD (Monitor / Android / Windows)',
    thumbnail_url: dm215gHero,
    cpu: 'Plug & Play / RK3568 / Intel (TBD)',
    ram_gb: 4,
    storage_gb: 32,
    storage_type: 'eMMC / SSD',
    has_wifi: true,
    has_4g: false,
    os: 'Plug & Play / Android 11-13 / Windows 10-11',
    form_factor: 'Industrial Touch PC',
    unit_price: 17990,
    stock_status: 'available',
  },
];

export function getShopStaticCompareProducts(slugs: string[]): ShopStaticCompareProduct[] {
  if (!slugs.length) return [];
  const set = new Set(slugs.map((s) => s.toLowerCase()));
  return SHOP_STATIC_COMPARE_PRODUCTS.filter((p) => set.has(p.slug.toLowerCase()));
}
