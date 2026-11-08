# Shared six-color UI template

Reference: user-provided six circular color swatches, 2026-11-03. Hex values are approximate visual matches.

| Token | Hex | Use |
|---|---|---|
| Coral | #F57455 | Intake, pending work |
| Lime | #D4DF16 | Rate, analytics, summary |
| Cyan | #00B8DB | Total, information, navigation |
| Teal | #00A59C | Completed, success |
| Red | #EF1524 | Delete, danger, critical alerts |
| Yellow | #FFCC00 | In progress, attention |

Light KPI cards use solid palette backgrounds with #102D32 text. Dark cards mix 35% palette color with #101E2E and use white text; Google Fonts icons use their original styling with transparent glyph backgrounds. Do not apply the six-color palette as a background to Google Fonts glyphs. Do not change data/status semantics when changing visible labels. Keep icon glyphs separate from their background containers. Apply the same template to other projects when requested, changing the project name only.

Current overview labels: เรื่องที่แจ้งทั้งหมด, รับเรื่อง, กำลังดำเนินการ, ปิดงานแล้ว, อัตราการปิดงาน.


Card surface standard (2026-11-03): Light = reference hue 75% + white 25%. Dark = previous dark hue mix 75% + white 25%. Reuse the same hue tokens for cards across pages; select by existing tone, default Cyan for neutral information cards. Google Fonts glyphs remain transparent.
