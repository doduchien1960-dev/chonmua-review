# Chọn Mua Review — Blog affiliate tĩnh

Blog review đồ gia dụng & công nghệ tầm trung, kiếm tiền qua link affiliate Shopee.
Static HTML/CSS thuần túy, không framework, responsive mobile.

## Cấu trúc

```
blog-affiliate/
├── index.html                    Trang chủ
├── css/style.css                 1 file CSS dùng chung
├── bai-viet/
│   ├── noi-chien-khong-dau.html      Bài 1: Top 5 nồi chiên không dầu
│   ├── tai-nghe-bluetooth-duoi-500k.html  Bài 2: Top 5 tai nghe < 500k
│   └── sac-du-phong.html             Bài 3: Top 5 sạc dự phòng
├── danh-muc/
│   ├── gia-dung.html             Chuyên mục Gia dụng
│   └── cong-nghe.html            Chuyên mục Công nghệ
├── gioi-thieu.html               Giới thiệu
├── chinh-sach.html               Chính sách + affiliate disclosure
├── sitemap.xml / robots.txt
└── links.md                      Quản lý 15 placeholder link affiliate
```

SEO: `lang="vi"`, title/meta/OG mỗi trang, canonical, JSON-LD Article, semantic HTML.

## Checklist việc còn lại

- [ ] **Kiểm tra lại model & giá** trong 3 bài (mã model, dung tích, giá tham khảo) trước khi public
- [ ] **Push lên GitHub**: tạo repo mới (cần token mới của Đỗ — không push hộ khi chưa có)
- [ ] **Deploy Vercel**: import repo → có domain `*.vercel.app`
- [ ] **Thay domain thật**: thay toàn bộ `chonmua-review.vercel.app` trong sitemap.xml, robots.txt, canonical/OG các trang
- [ ] **Đăng ký Shopee Affiliate**: lấy link cho 15 sản phẩm trong `links.md`, thay placeholder bằng `sed`
- [ ] **Google Search Console**: submit sitemap.xml
- [ ] Viết thêm 1-2 bài/tuần để blog có traffic (mỗi bài mới: thêm vào index + chuyên mục + sitemap)
