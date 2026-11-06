"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Product, Category, API_URL, formatVND, imageUrl, finalPrice } from "@/lib/api";

function CategoriesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_URL}/api/categories`).then((res) => res.json()),
      fetch(`${API_URL}/api/brands`).then((res) => res.json()),
    ]).then(([prods, cats, brnds]) => {
      setProducts(prods);
      setCategories(cats);
      setBrands(brnds);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy]);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, name: product.name, image: product.image, price: finalPrice(product), qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const filteredProducts = products
    .filter((product) => {
      const matchCat = selectedCategory === "all" || product.category_id.toString() === selectedCategory;
      const matchBrand = selectedBrand === "all" || product.brand_id?.toString() === selectedBrand;
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const p = finalPrice(product);
      let matchPrice = true;
      if (priceRange === "under5") matchPrice = p < 5000000;
      else if (priceRange === "5to15") matchPrice = p >= 5000000 && p <= 15000000;
      else if (priceRange === "15to25") matchPrice = p > 15000000 && p <= 25000000;
      else if (priceRange === "over25") matchPrice = p > 25000000;
      return matchCat && matchBrand && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return finalPrice(a) - finalPrice(b);
      if (sortBy === "price_desc") return finalPrice(b) - finalPrice(a);
      return b.id - a.id;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Đang tải...</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* CỘT BỘ LỌC */}
      <div className="w-full md:w-1/4">
        <div className="bg-white p-5 rounded-xl shadow-md border space-y-5">
          <h2 className="text-lg font-bold border-b pb-2">Bộ lọc tìm kiếm</h2>

          <div>
            <label className="block text-sm font-semibold mb-1">Từ khóa</label>
            <input type="text" placeholder="Nhập tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border p-2 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Danh mục</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border p-2 rounded-lg text-sm">
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Thương hiệu</label>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full border p-2 rounded-lg text-sm">
              <option value="all">Tất cả thương hiệu</option>
              {brands.map((b) => <option key={b.id} value={b.id.toString()}>{b.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Mức giá</label>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full border p-2 rounded-lg text-sm">
              <option value="all">Tất cả mức giá</option>
              <option value="under5">Dưới 5 triệu</option>
              <option value="5to15">Từ 5 - 15 triệu</option>
              <option value="15to25">Từ 15 - 25 triệu</option>
              <option value="over25">Trên 25 triệu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Sắp xếp theo</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border p-2 rounded-lg text-sm">
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM & PHÂN TRANG */}
      <div className="w-full md:w-3/4">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Danh sách Sản phẩm</h1>
          <span className="text-sm text-gray-500">Hiển thị {paginatedProducts.length} / {filteredProducts.length} sản phẩm</span>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => {
                const imgSrc = imageUrl(product.image);
                return (
                  <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
                    <Link href={`/product/${product.id}`}>
                      <div className="h-52 bg-gray-50 p-4 flex justify-center items-center">
                        {imgSrc ? <img src={imgSrc} alt={product.name} className="max-h-full object-contain" /> : <div>Chưa có ảnh</div>}
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">{product.name}</h3>
                      </Link>
                      <div className="mt-auto">
                        <div className="text-red-600 font-bold text-lg">{formatVND(finalPrice(product))}</div>
                        {product.sale_price && Number(product.sale_price) > 0 && (
                          <div className="text-xs text-gray-400 line-through">{formatVND(product.price)}</div>
                        )}
                        <button onClick={() => addToCart(product)} className="w-full mt-3 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 text-sm">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* THANH PHÂN TRANG */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-lg bg-white disabled:opacity-40 font-semibold"
                >
                  &laquo; Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-bold border ${currentPage === page ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 border rounded-lg bg-white disabled:opacity-40 font-semibold"
                >
                  Sau &raquo;
                </button>
              </div>
            )}
          </>
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