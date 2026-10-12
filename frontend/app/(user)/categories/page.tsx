"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category, API_URL, formatVND, imageUrl, finalPrice } from "@/lib/api";

function CategoriesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);

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

  // Logic Lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === "all" || product.category_id.toString() === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <div className="text-center py-20 text-xl font-semibold text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Cột trái: Bộ lọc (Sidebar) */}
      <div className="w-full md:w-1/4">
        <div className="bg-white p-5 rounded-xl shadow-md border sticky top-4">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Tìm kiếm nâng cao</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
            <input
              type="text"
              placeholder="Nhập tên để tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục sản phẩm</label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="radio" name="category" value="all" checked={selectedCategory === "all"} onChange={() => setSelectedCategory("all")} className="w-4 h-4 text-blue-600" />
                <span>Tất cả danh mục</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={selectedCategory === cat.id.toString()}
                    onChange={() => setSelectedCategory(cat.id.toString())}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Danh sách sản phẩm */}
      <div className="w-full md:w-3/4">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Sản phẩm của chúng tôi</h1>
          <span className="text-gray-500 font-medium">Tìm thấy {filteredProducts.length} sản phẩm</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm border text-center text-gray-500 text-lg">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa hoặc danh mục này.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col group">
                <div className="h-56 bg-gray-50 p-4 flex justify-center items-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl(product.image) || ""} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2" title={product.name}>{product.name}</h3>
                  <div className="mt-auto">
                    <div className="text-red-600 font-bold text-lg">{formatVND(finalPrice(product))}</div>
                    {product.sale_price && product.sale_price > 0 && (
                        <div className="text-sm text-gray-400 line-through">{formatVND(product.price)}</div>
                    )}
                    <button onClick={() => addToCart(product)} className="w-full mt-3 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}