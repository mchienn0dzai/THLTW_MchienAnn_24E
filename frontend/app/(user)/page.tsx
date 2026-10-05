"use client";
import { useEffect, useState } from "react";
import { API_URL, Category, Product, finalPrice, formatVND, imageUrl } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tải danh mục 1 lần
  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setError("Không kết nối được backend. Hãy chạy: php artisan serve"));
  }, []);

  // Tải sản phẩm mỗi khi đổi danh mục / từ khoá
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCat) params.set("category_id", String(activeCat));
    if (search.trim()) params.set("search", search.trim());

    setLoading(true);
    const t = setTimeout(() => {
      fetch(`${API_URL}/api/products?${params}`)
        .then((r) => r.json())
        .then((data) => {
          setProducts(Array.isArray(data) ? data : []);
          setError("");
        })
        .catch(() => setError("Không kết nối được backend. Hãy chạy: php artisan serve"))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [activeCat, search]);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: { id: number }) => item.id === product.id);
    if (existing) {
      existing.qty = (existing.qty ?? existing.quantity ?? 1) + 1;
      delete existing.quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: finalPrice(product),
        qty: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Sản Phẩm Mới Nhất</h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat(null)}
            className={`px-4 py-1.5 rounded-full border text-sm ${activeCat === null ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`px-4 py-1.5 rounded-full border text-sm ${activeCat === c.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="border rounded px-3 py-2 w-full md:w-64"
        />
      </div>

      {error && <div className="mb-6 text-center text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      {loading ? (
        <div className="text-center text-gray-500 py-10">Đang tải sản phẩm...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Không có sản phẩm nào.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => {
            const img = imageUrl(p.image);
            const hasSale = p.sale_price && p.sale_price < p.price;
            return (
              <div key={p.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 italic overflow-hidden">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    "Hình ảnh sản phẩm"
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-xs text-gray-500 mb-1">
                    {p.category?.name} · {p.brand?.name}
                  </p>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{p.name}</h2>
                  <div className="mb-4">
                    <span className="text-red-600 font-bold">{formatVND(finalPrice(p))}</span>
                    {hasSale && (
                      <span className="ml-2 text-sm text-gray-400 line-through">{formatVND(p.price)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.stock_qty <= 0}
                    className="mt-auto w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {p.stock_qty > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
