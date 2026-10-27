# Quản lý link affiliate — Chọn Mua Review

**Cách dùng:** Trong các file HTML, link affiliate đang ở dạng placeholder `{{AFF_LINK_TEN}}`.
Khi có link thật từ Shopee Affiliate (hoặc ACCESSTRADE), thay hàng loạt bằng lệnh:

```bash
cd ~/workspace/goals/muse-self-earning-income-plan/files/blog-affiliate
sed -i 's|{{AFF_LINK_NOI-CHIEN-PHILIPS-HD9252}}|https://shopee.vn/...|g' bai-viet/*.html
```

(Lặp lại cho từng placeholder bên dưới.)

**Lưu ý:** Domain `chonmua-review.vercel.app` trong sitemap.xml, robots.txt và các thẻ
canonical/OG hiện là tên dự kiến. Sau khi deploy Vercel có domain thật, thay toàn bộ
`chonmua-review.vercel.app` bằng domain thật.

## Danh sách placeholder

### Bài nồi chiên không dầu
| Placeholder | Sản phẩm |
|---|---|
| `{{AFF_LINK_NOI-CHIEN-PHILIPS-HD9252}}` | Philips HD9252/90 — 4.1L |
| `{{AFF_LINK_NOI-CHIEN-LOCKNLOCK-EJF357}}` | Lock&Lock EJF357 — 5.2L |
| `{{AFF_LINK_NOI-CHIEN-KALITE-Q10}}` | Kalite Q10 — 10L |
| `{{AFF_LINK_NOI-CHIEN-SUNHOUSE-SHD4030}}` | Sunhouse SHD4030 — 3.5L |
| `{{AFF_LINK_NOI-CHIEN-MAGIC-AC110}}` | Magic Eco AC-110 — 4.4L |

### Bài tai nghe Bluetooth
| Placeholder | Sản phẩm |
|---|---|
| `{{AFF_LINK_TAINGHE-REDMI-BUDS4-LITE}}` | Xiaomi Redmi Buds 4 Lite |
| `{{AFF_LINK_TAINGHE-EDIFIER-X2S}}` | Edifier X2s |
| `{{AFF_LINK_TAINGHE-SOUNDPEATS-TRUEFREE2}}` | SoundPEATS TrueFree 2 |
| `{{AFF_LINK_TAINGHE-BASEUS-BOWIE-E9}}` | Baseus Bowie E9 |
| `{{AFF_LINK_TAINGHE-LENOVO-XT88}}` | Lenovo ThinkPlus XT88 |

### Bài sạc dự phòng
| Placeholder | Sản phẩm |
|---|---|
| `{{AFF_LINK_SACDUPHONG-XIAOMI-20000-18W}}` | Xiaomi Power Bank 20000mAh 18W |
| `{{AFF_LINK_SACDUPHONG-BASEUS-20000-225W}}` | Baseus 20000mAh 22.5W |
| `{{AFF_LINK_SACDUPHONG-ANKER-323-10000}}` | Anker 323 (PowerCore 10000mAh) |
| `{{AFF_LINK_SACDUPHONG-UGREEN-20000-PD}}` | Ugreen 20000mAh PD 22.5W |
| `{{AFF_LINK_SACDUPHONG-SAMSUNG-10000-25W}}` | Samsung Battery Pack 10000mAh 25W |

### Bài so sánh Philips vs Lock&Lock
| Placeholder | Sản phẩm |
|---|---|
| `{{AFF_LINK_NOI-CHIEN-PHILIPS-HD9280}}` | Philips HD9280/90 — 6.2L |
| `{{AFF_LINK_NOI-CHIEN-LOCKNLOCK-EJF376}}` | Lock&Lock EJF376BLK — 5L |

### Bài máy xay sinh tố
| Placeholder | Sản phẩm |
|---|---|
| `{{AFF_LINK_MAYXAY-PHILIPS-HR2223}}` | Philips HR2223 |
| `{{AFF_LINK_MAYXAY-PANASONIC-MXMG53}}` | Panasonic MX-MG53 |
| `{{AFF_LINK_MAYXAY-SUNHOUSE-SHD5112}}` | Sunhouse SHD5112 |
| `{{AFF_LINK_MAYXAY-KANGAROO-KG4B3}}` | Kangaroo KG4B3 |
| `{{AFF_LINK_MAYXAY-BLUESTONE-BLB5335}}` | BlueStone BLB-5335 |

### Bài top 5 ấm siêu tốc 2026
| Placeholder | Sản phẩm |
|---|---|
| `{{AFF_LINK_AM-SIEU-TOC-SHD1351}}` | Sunhouse SHD1351 — 1.8L |
| `{{AFF_LINK_AM-SIEU-TOC-EJK738}}` | Lock&Lock EJK738 — 1.7L |
| `{{AFF_LINK_AM-SIEU-TOC-HD9306}}` | Philips HD9306 — 1.5L |
| `{{AFF_LINK_AM-SIEU-TOC-HD9339}}` | Philips HD9339/80 — 1.7L thủy tinh |
| `{{AFF_LINK_AM-SIEU-TOC-KT-17DR1NV}}` | Toshiba KT-17DR1NV — 1.7L |

Tổng: **27 placeholder** link affiliate.

### Bài đối đầu sạc dự phòng 20000mAh: Baseus vs Ugreen vs Xiaomi (nháp 27/10/2026, branch draft/sac-du-phong-20000mah-baseus-ugreen-xiaomi)
Link tạm trong HTML hiện là link tìm kiếm Shopee (blog đang chờ Shopee duyệt affiliate). Khi có link thật, thay các link tìm kiếm dưới đây bằng link affiliate; placeholder cho 3 sản phẩm này đã có sẵn ở mục "Bài sạc dự phòng" phía trên, không tạo placeholder mới trùng.

| Sản phẩm | Link tìm kiếm tạm trong HTML |
|---|---|
| Xiaomi Mi Power Bank 3 PLM18ZM | https://shopee.vn/search?keyword=Xiaomi%20Mi%20Power%20Bank%203%2020000mAh%2018W |
| Baseus Adaman PPADM20S | https://shopee.vn/search?keyword=Baseus%20Adaman%2020000mAh%2022.5W |
| Ugreen PB312 25683B | https://shopee.vn/search?keyword=Ugreen%20PB312%2020000mAh |
