/**
 * URL ảnh từ API (phim: poster, đồ ăn: image) — tối ưu kích thước + fallback giống HomePage.
 */
import { PRODUCT_CATEGORY } from '@shared/constants/food-constants';

export type ImageVariant = 'hero' | 'poster' | 'thumb';

/** Giống HomePage — poster mặc định */
export const MOVIE_POSTER_FALLBACK =
  'https://images.unsplash.com/photo-1489599856769-c5ae6f84f5a7?w=800&h=1200&fit=crop';

export const MOVIE_HERO_FALLBACK =
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop';

/** Ảnh dự phòng theo danh mục sản phẩm (bắp / nước / combo) */
export const PRODUCT_IMAGE_FALLBACK: Record<string, string> = {
  [PRODUCT_CATEGORY.POPCORN]:
    'https://images.unsplash.com/photo-1585647347483-23c0f3e6dbf9?w=800&h=600&fit=crop',
  [PRODUCT_CATEGORY.DRINK]:
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600&fit=crop',
  [PRODUCT_CATEGORY.COMBO]:
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=600&fit=crop',
  [PRODUCT_CATEGORY.OTHER]:
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
};

export const DEFAULT_PRODUCT_IMAGE_FALLBACK = PRODUCT_IMAGE_FALLBACK.OTHER;

/**
 * Chuẩn hoá `image` từ DB: bỏ đường dẫn sai (vd. `/api/food/upload_image/...`),
 * chỉ còn tên file → `/uploads/...`.
 */
export function normalizeProductImageStoredValue(
  raw: string | null | undefined,
): string | null {
  if (raw == null) return null;
  const t = typeof raw === 'string' ? raw.trim() : String(raw).trim();
  if (!t) return null;

  /** HTTP(S): phải chặn trước — không trả về URL trỏ nhầm POST /api/food/upload-image */
  if (/^https?:\/\//i.test(t)) {
    try {
      const u = new URL(t);
      if (u.pathname.includes('/api/food/')) return null;
    } catch {
      return null;
    }
    return t;
  }

  /** Đường dẫn tương đối: không dùng /api/... làm ảnh (GET sẽ 404) */
  if (
    t.startsWith('/api/') ||
    /\/api\/food\//i.test(t) ||
    /^api\/food\//i.test(t) ||
    /upload-image|upload_image/i.test(t)
  ) {
    return null;
  }

  if (/^(data:|\/\/)/i.test(t)) return t;
  if (t.startsWith('/uploads/')) return t;
  if (t.startsWith('uploads/')) return `/${t}`;
  /** Chỉ tên file do multer lưu (image-xxx.jpg) */
  if (/^[a-zA-Z0-9._-]+\.(jpe?g|png|webp)$/i.test(t)) {
    return `/uploads/${t}`;
  }
  if (t.startsWith('/')) return t;
  return t;
}

/**
 * URL tương đối (`/uploads/...`) → URL tuyệt đối qua gốc API (bỏ `/api`).
 * URL đầy đủ https/http/data giữ nguyên.
 */
export function absoluteUrlIfNeeded(url: string): string {
  const t = url.trim();
  if (!t) return t;
  /** Không ghép origin cho route API — không phải file tĩnh */
  if (t.startsWith('/api/')) return '';
  if (/^(https?:|data:|\/\/)/i.test(t)) return t;
  if (t.startsWith('/')) {
    const base =
      (import.meta.env.VITE_API_URL as string | undefined) ||
      'http://localhost:5000/api';
    const origin = base.replace(/\/api\/?$/, '');
    return `${origin}${t}`;
  }
  return t;
}

/** Ảnh dự phòng theo danh mục (dùng cho `fallbackSrc` khi URL gốc lỗi). */
export function getProductImageFallback(
  category: string | undefined,
): string {
  return (
    (category && PRODUCT_IMAGE_FALLBACK[category]) ??
    DEFAULT_PRODUCT_IMAGE_FALLBACK
  );
}

export function optimizeImageUrl(url: string, variant: ImageVariant): string {
  let optimized = url.trim();

  if (optimized.includes('image.tmdb.org/t/p/')) {
    if (variant === 'hero') {
      return optimized.replace(/\/w\d+\//, '/original/');
    }
    if (variant === 'thumb') {
      return optimized.replace(/\/w\d+\//, '/w342/');
    }
    return optimized.replace(/\/w\d+\//, '/w780/');
  }

  return optimized;
}

/**
 * Chuỗi URL từ DB (poster / image) → URL hiển thị, hoặc ảnh mặc định.
 */
export function resolveImageUrl(
  primaryUrl: string | null | undefined,
  variant: ImageVariant,
  fallbackUrl: string,
): string {
  if (primaryUrl && primaryUrl.trim().length > 0) {
    return optimizeImageUrl(absoluteUrlIfNeeded(primaryUrl), variant);
  }
  return optimizeImageUrl(fallbackUrl, variant);
}

/**
 * Ảnh sản phẩm đồ ăn — dùng `image` từ API; nếu trống/lỗi thì fallback theo category (POPCORN, DRINK, COMBO…).
 */
export function getProductImageUrl(
  imageUrl: string | null | undefined,
  category: string | undefined,
  variant: ImageVariant = 'thumb',
): string {
  const fallback = getProductImageFallback(category);
  const normalized = normalizeProductImageStoredValue(imageUrl);
  return resolveImageUrl(normalized, variant, fallback);
}
