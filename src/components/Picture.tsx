import { ImgHTMLAttributes, memo } from 'react';

/**
 * Performance-optimized <picture> wrapper.
 *
 * - Tries .webp first (auto-derived from src), falls back to original format.
 * - Defaults to lazy loading + async decoding (override with priority for above-fold images).
 * - Use anywhere instead of plain <img> for instant 60-90% bandwidth savings on large photos.
 *
 * Only rewrites local /public assets (paths starting with "/" or "./") that end with
 * .png / .jpg / .jpeg. Remote URLs and other formats pass through untouched.
 */
type PictureProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Mark as above-the-fold to disable lazy loading + use eager decoding. */
  priority?: boolean;
};

const RASTER_RE = /\.(png|jpe?g)(\?.*)?$/i;

const toWebp = (src?: string): string | null => {
  if (!src) return null;
  // Skip data URIs, blob:, and absolute URLs (we can't pre-generate webp for those)
  if (/^(data:|blob:|https?:)/i.test(src)) return null;
  if (!RASTER_RE.test(src)) return null;
  return src.replace(RASTER_RE, '.webp$2');
};

const Picture = memo(function Picture({
  src,
  alt = '',
  priority = false,
  loading,
  decoding,
  fetchPriority,
  ...rest
}: PictureProps) {
  const webp = toWebp(src as string | undefined);

  const imgProps: ImgHTMLAttributes<HTMLImageElement> = {
    src,
    alt,
    loading: loading ?? (priority ? 'eager' : 'lazy'),
    decoding: decoding ?? 'async',
    // @ts-expect-error fetchpriority is valid HTML, types lag behind
    fetchpriority: fetchPriority ?? (priority ? 'high' : undefined),
    ...rest,
  };

  if (!webp) {
    // No WebP variant possible — render plain img with lazy defaults
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...imgProps} />;
  }

  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...imgProps} />
    </picture>
  );
});

export default Picture;
