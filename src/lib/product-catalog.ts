/**
 * Unified product catalog for related product suggestions
 * Used by QuoteRequestButton for upselling/cross-selling
 */

import { aioProducts } from '@/data/aio-products';
import { iboxProducts } from '@/data/ibox-products';
import { ruggedNotebooks } from '@/data/rugged-notebook-products';
import { handheldProducts } from '@/data/rugged-handheld-products';
import { getAllTabletProducts } from '@/data/rugged-tablet-products';

export interface CatalogProduct {
  model: string;
  name: string;
  category: string;
  image?: string;
  price?: string;
}

let _catalog: CatalogProduct[] | null = null;

function buildCatalog(): CatalogProduct[] {
  if (_catalog) return _catalog;

  const catalog: CatalogProduct[] = [];

  // AIO / Box PC / Panel PC
  for (const p of aioProducts) {
    catalog.push({
      model: p.model,
      name: p.titleTH || p.title,
      category: p.category === 'box-pc' ? 'Box PC' : p.category === 'aio-desktop' ? 'AIO Desktop' : 'Panel PC',
      image: p.image,
      price: p.price,
    });
  }

  // iBox Mini PC
  for (const p of iboxProducts) {
    catalog.push({
      model: p.id,
      name: p.name,
      category: 'Mini PC',
      image: p.image,
    });
  }

  // Rugged Notebooks
  for (const p of ruggedNotebooks) {
    catalog.push({
      model: p.model,
      name: p.titleTH || p.title,
      category: 'Rugged Notebook',
      image: p.image,
    });
  }

  // Rugged Tablets
  for (const p of getAllTabletProducts()) {
    catalog.push({
      model: p.model,
      name: p.nameTH || p.name,
      category: 'Rugged Tablet',
      image: p.image,
      price: p.price,
    });
  }

  // Handheld
  for (const p of handheldProducts) {
    catalog.push({
      model: p.model,
      name: p.name,
      category: 'Handheld',
      image: p.image,
    });
  }

  _catalog = catalog;
  return catalog;
}

/**
 * Get related products for a given model
 * Strategy: same category first, then other categories
 */
export function getRelatedCatalogProducts(
  currentModel: string,
  limit = 4,
): CatalogProduct[] {
  const catalog = buildCatalog();
  const current = catalog.find((p) => p.model === currentModel);
  if (!current) return catalog.filter((p) => p.model !== currentModel).slice(0, limit);

  const sameCategory = catalog.filter(
    (p) => p.model !== currentModel && p.category === current.category,
  );
  const otherCategory = catalog.filter(
    (p) => p.model !== currentModel && p.category !== current.category,
  );

  // Shuffle same category for variety, take up to limit
  const shuffled = sameCategory.sort(() => Math.random() - 0.5);
  const result = [...shuffled.slice(0, limit)];

  // Fill remaining slots with other categories
  if (result.length < limit) {
    const remaining = otherCategory.sort(() => Math.random() - 0.5);
    result.push(...remaining.slice(0, limit - result.length));
  }

  return result;
}

/**
 * Get unique categories from catalog
 */
export function getCatalogCategories(): string[] {
  const catalog = buildCatalog();
  return [...new Set(catalog.map((p) => p.category))];
}

/**
 * Search products by keyword with optional category filter
 */
export function searchCatalogProducts(query: string, limit = 10, category?: string): CatalogProduct[] {
  const catalog = buildCatalog();
  let filtered = catalog;
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (!query.trim()) return filtered.slice(0, limit);
  const q = query.toLowerCase();
  return filtered
    .filter((p) => p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
    .slice(0, limit);
}

/**
 * Get all catalog products with optional category filter
 */
export function browseCatalogProducts(category?: string, limit = 20): CatalogProduct[] {
  const catalog = buildCatalog();
  let filtered = catalog;
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }
  return filtered.slice(0, limit);
}
