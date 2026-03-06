import qrcode
import os

# Đường dẫn đến file hoặc URL muốn hiển thị khi quét mã
# Khi bạn đưa web lên mạng (VD: github pages, vercel), hãy thay thế URL này.
# Hiện tại để một link demo mẫu:
url_to_encode = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" # Link tạm thời

def generate_qr_code(url, filename="qrcode.png"):
    print(f"Bắt đầu tạo QR code cho URL: {url}")
    
    # Tạo object QRCode với các tham số cấu hình
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H, 
        box_size=10,
        border=4,
    )
    
    # Thêm dữ liệu
    qr.add_data(url)
    qr.make(fit=True)

    # Tạo hình ảnh
    img = qr.make_image(fill_color="#d81b60", back_color="white") # Màu hồng đậm cho hợp theme
    
    # Lấy đường dẫn tuyệt đối của thư mục chứa script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, filename)

    # Lưu ảnh
    img.save(output_path)
    print(f"Đã tạo QR code thành công: {output_path}")

if __name__ == "__main__":
    generate_qr_code(url_to_encode)
