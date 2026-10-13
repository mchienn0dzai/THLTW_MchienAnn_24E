"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL, formatVND, imageUrl, finalPrice } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
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

  if (loading) return <div className="text-center py-20 text-xl font-semibold text-gray-500">Đang tải dữ liệu...</div>;
  if (!product || product.message) return <div className="text-center py-20 text-xl text-red-500 font-bold">Sản phẩm không tồn tại!</div>;

  const imgSrc = imageUrl(product.image);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col md:flex-row gap-10">
        
        {/* Cột Ảnh Sản Phẩm */}
        <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 rounded-xl p-6 border overflow-hidden">
          {imgSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imgSrc} alt={product.name} className="max-w-full max-h-[450px] object-contain hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="text-gray-400 font-medium text-lg">Chưa có ảnh</div>
          )}
        </div>

        {/* Cột Thông tin Chi tiết */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 bg-gray-50 w-fit px-4 py-2 rounded-lg border">
            <p>Danh mục: <span className="font-semibold text-blue-600">{product.category?.name || "Không rõ"}</span></p>
            <p>|</p>
            <p>Thương hiệu: <span className="font-semibold text-blue-600">{product.brand?.name || "Không rõ"}</span></p>
          </div>

          <div className="mb-6 flex items-end gap-4">
            <span className="text-4xl font-extrabold text-red-600">{formatVND(finalPrice(product))}</span>
            {product.sale_price && product.sale_price > 0 && (
              <span className="text-xl text-gray-400 line-through mb-1">{formatVND(product.price)}</span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Tình trạng:</h3>
            <span className={`px-3 py-1 rounded text-sm font-bold ${product.stock_qty > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {product.stock_qty > 0 ? `Còn hàng (${product.stock_qty} sản phẩm)` : "Tạm hết hàng"}
            </span>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-2 border-b pb-2">Mô tả sản phẩm:</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mt-2">
              {product.description || "Chưa có bài viết mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>

          <button 
            onClick={addToCart} 
            disabled={product.stock_qty <= 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-md ${
              product.stock_qty > 0 
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {product.stock_qty > 0 ? "🛒 THÊM VÀO GIỎ HÀNG" : "TẠM HẾT HÀNG"}
          </button>
        </div>
      </div>
    </div>
  );
}