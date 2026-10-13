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
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: product.id, name: product.name, image: product.image, price: finalPrice(product), qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Đang tải dữ liệu...</div>;

  const activeCategories = categories.filter(cat => products.some(p => p.category_id === cat.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-10 text-white mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Chào mừng đến với E-Shop</h1>
        <p className="text-lg opacity-90 mb-6">Khám phá những thiết bị công nghệ đỉnh cao với giá tốt nhất.</p>
        <Link href="/categories" className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">Khám phá ngay</Link>
      </div>

      {activeCategories.map((category) => {
        const categoryProducts = products.filter(p => p.category_id === category.id).slice(0, 4);

        return (
          <div key={category.id} className="mb-12">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-blue-600 pl-3">{category.name} Nổi Bật</h2>
              <Link href={`/categories?cat=${category.id}`} className="text-blue-600 hover:underline font-medium">Xem tất cả &rarr;</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => {
                const imgSrc = imageUrl(product.image);
                return (
                  <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col group">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="h-48 bg-gray-50 flex justify-center items-center p-4 relative overflow-hidden">
                        {imgSrc ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={imgSrc} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="text-gray-400 font-medium text-sm">Chưa có ảnh</div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <Link href={`/product/${product.id}`} className="block">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2 hover:text-blue-600 transition" title={product.name}>{product.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-2">{category.name}</p>
                      <div className="mt-auto">
                        <div className="text-red-600 font-bold text-xl">{formatVND(finalPrice(product))}</div>
                        {product.sale_price && product.sale_price > 0 && (
                          <div className="text-sm text-gray-400 line-through">{formatVND(product.price)}</div>
                        )}
                        <button onClick={() => addToCart(product)} className="w-full mt-4 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}