"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Product, Category, API_URL, formatVND, imageUrl, finalPrice } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_URL}/api/categories`).then((res) => res.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, name: product.name, image: product.image, price: finalPrice(product), qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Đang tải dữ liệu...</div>;

  const newProducts = [...products].slice(0, 4);
  const saleProducts = products.filter((p) => p.sale_price && Number(p.sale_price) > 0 && Number(p.sale_price) < Number(p.price)).slice(0, 4);
  const hotProducts = [...products].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 4);

  const renderGrid = (list: Product[], badge?: string) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {list.map((product) => {
        const imgSrc = imageUrl(product.image);
        return (
          <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col relative group">
            {badge && (
              <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {badge}
              </span>
            )}
            <Link href={`/product/${product.id}`} className="block">
              <div className="h-48 bg-gray-50 flex justify-center items-center p-4">
                {imgSrc ? <img src={imgSrc} alt={product.name} className="max-h-full object-contain group-hover:scale-105 transition" /> : <div className="text-gray-400">Chưa có ảnh</div>}
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-grow">
              <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-blue-600">{product.name}</h3>
              </Link>
              <div className="mt-auto pt-2">
                <div className="text-red-600 font-bold text-lg">{formatVND(finalPrice(product))}</div>
                {product.sale_price && Number(product.sale_price) > 0 && (
                  <div className="text-xs text-gray-400 line-through">{formatVND(product.price)}</div>
                )}
                <button onClick={() => addToCart(product)} className="w-full mt-3 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 text-sm">
                  + Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-10 text-white text-center">
        <h1 className="text-4xl font-extrabold mb-3">Chào mừng đến với E-Shop</h1>
        <p className="text-lg opacity-90 mb-6">Sản phẩm công nghệ chính hãng - Ưu đãi ngập tràn mỗi ngày</p>
        <Link href="/categories" className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100">
          Mua sắm ngay
        </Link>
      </div>

      {/* 1. SẢN PHẨM MỚI */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-green-600 pl-3 mb-6">🆕 Sản phẩm Mới nhất</h2>
        {renderGrid(newProducts, "NEW")}
      </section>

      {/* 2. SẢN PHẨM KHUYẾN MÃI (SALE) */}
      {saleProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-red-600 uppercase border-l-4 border-red-600 pl-3 mb-6">🔥 Sản phẩm Đang Sale</h2>
          {renderGrid(saleProducts, "SALE")}
        </section>
      )}

      {/* 3. SẢN PHẨM HOT */}
      <section>
        <h2 className="text-2xl font-bold text-orange-600 uppercase border-l-4 border-orange-500 pl-3 mb-6">⚡ Sản phẩm Hot Nổi Bật</h2>
        {renderGrid(hotProducts, "HOT")}
      </section>

      {/* 4. FEATURE THEO DANH MỤC */}
      {categories.map((cat) => {
        const catProds = products.filter((p) => p.category_id === cat.id).slice(0, 4);
        if (catProds.length === 0) return null;
        return (
          <section key={cat.id}>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-blue-600 pl-3">{cat.name} Đặc sắc</h2>
              <Link href={`/categories?cat=${cat.id}`} className="text-blue-600 hover:underline font-medium">Xem tất cả &rarr;</Link>
            </div>
            {renderGrid(catProds)}
          </section>
        );
      })}
    </div>
  );
}