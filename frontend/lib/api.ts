// Địa chỉ backend Laravel. Có thể đổi bằng biến môi trường NEXT_PUBLIC_API_URL trong frontend/.env.local
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  category_id: number;
  brand_id: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  sale_price: number | null;
  stock_qty: number;
  description: string | null;
  status: boolean;
  category?: Category;
  brand?: Brand;
}

// Ảnh có thể là URL đầy đủ hoặc tên file nằm trong backend/public/images/products
export function imageUrl(image?: string | null): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL}/images/products/${image}`;
}

export const formatVND = (n: number | string) =>
  `${Number(n).toLocaleString("vi-VN")} đ`;

// Giá thực tế khách phải trả
export const finalPrice = (p: Pick<Product, "price" | "sale_price">) =>
  p.sale_price && p.sale_price > 0 ? p.sale_price : p.price;
