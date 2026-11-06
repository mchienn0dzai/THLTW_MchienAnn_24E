"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_URL, formatVND, imageUrl, finalPrice } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/products/${id}`).then((r) => r.json()),
      fetch(`${API_URL}/api/products`).then((r) => r.json()),
    ]).then(([prod, allProds]) => {
      setProduct(prod);
      if (prod && prod.category_id && Array.isArray(allProds)) {
        setRelatedProducts(
          allProds.filter((p: any) => p.category_id === prod.category_id && String(p.id) !== String(prod.id)).slice(0, 4)
        );
      }
      setLoading(false);
    });
  }, [id]);

  const addToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c: any) => c.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: item.id, name: item.name, image: item.image, price: finalPrice(item), qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Đang tải...</div>;
  if (!product || product.message) return <div className="text-center py-20 text-xl text-red-500 font-bold">Sản phẩm không tồn tại!</div>;

  const imgSrc = imageUrl(product.image);

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-12">
      <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 rounded-xl p-6 border">
          {imgSrc ? <img src={imgSrc} alt={product.name} className="max-h-[400px] object-contain" /> : <div>Chưa có ảnh</div>}
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <div className="flex gap-4 mb-4 text-sm text-gray-600 bg-gray-50 w-fit px-4 py-2 rounded-lg border">
            <span>Danh mục: <strong className="text-blue-600">{product.category?.name}</strong></span>
            <span>|</span>
            <span>Thương hiệu: <strong className="text-blue-600">{product.brand?.name}</strong></span>
          </div>

          <div className="mb-6 flex items-end gap-4">
            <span className="text-3xl font-extrabold text-red-600">{formatVND(finalPrice(product))}</span>
            {product.sale_price && Number(product.sale_price) > 0 && (
              <span className="text-lg text-gray-400 line-through">{formatVND(product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6 whitespace-pre-wrap">
            {product.description || "Sản phẩm chính hãng nguyên seal, bảo hành 12 tháng tại hệ thống E-Shop."}
          </p>

          <button onClick={() => addToCart(product)} className="w-full py-4 rounded-xl font-bold text-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md">
            🛒 THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>

      {/* SẢN PHẨM LIÊN QUAN */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-blue-600 pl-3 mb-6">
          Sản phẩm liên quan cùng danh mục
        </h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm liên quan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => {
              const rpImg = imageUrl(rp.image);
              return (
                <div key={rp.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md flex flex-col">
                  <Link href={`/product/${rp.id}`}>
                    <div className="h-40 flex justify-center items-center mb-3">
                      {rpImg && <img src={rpImg} alt={rp.name} className="max-h-full object-contain" />}
                    </div>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 mb-2">{rp.name}</h3>
                  </Link>
                  <div className="mt-auto">
                    <div className="text-red-600 font-bold">{formatVND(finalPrice(rp))}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}