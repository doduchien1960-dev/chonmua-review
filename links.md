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

Tổng: **22 placeholder** link affiliate.
