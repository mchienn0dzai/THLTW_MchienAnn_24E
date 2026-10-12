export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Về E-Shop</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-md space-y-6 text-gray-700 leading-relaxed border">
        <p className="text-lg">
          Chào mừng bạn đến với <strong>E-Shop</strong> - Nền tảng mua sắm thiết bị công nghệ trực tuyến hàng đầu. 
          Chúng tôi tự hào mang đến cho khách hàng những sản phẩm chính hãng, chất lượng cao từ các thương hiệu danh tiếng trên thế giới.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 border-b pb-2">Tầm nhìn & Sứ mệnh</h2>
        <p>
          Sứ mệnh của E-Shop là kết nối người tiêu dùng Việt Nam với những công nghệ tiên tiến nhất một cách nhanh chóng, an toàn và tiết kiệm. 
          Chúng tôi không ngừng nỗ lực cải thiện dịch vụ chăm sóc khách hàng, tối ưu hóa quy trình giao hàng và đảm bảo quyền lợi tối đa cho người mua.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 border-b pb-2">Tại sao chọn E-Shop?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Sản phẩm chính hãng 100%:</strong> Đầy đủ giấy tờ, bảo hành từ nhà sản xuất.</li>
          <li><strong>Giá cả cạnh tranh:</strong> Thường xuyên có các chương trình khuyến mãi và ưu đãi độc quyền.</li>
          <li><strong>Giao hàng tốc độ:</strong> Mạng lưới vận chuyển rộng khắp, nhận hàng trong 24h tại các thành phố lớn.</li>
          <li><strong>Hỗ trợ tận tâm:</strong> Đội ngũ tư vấn kỹ thuật trực tuyến sẵn sàng giải đáp mọi thắc mắc 24/7.</li>
        </ul>
      </div>
    </div>
  );
}