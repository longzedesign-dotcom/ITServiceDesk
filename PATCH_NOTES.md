# ITSD Patch versions

ใช้ลำดับเวอร์ชันตามที่ผู้ใช้กำหนด: V1.0.99 → V1.1.01 → V1.1.02 → … → V1.1.10 → …
เลข Patch หลังจุดสุดท้ายใช้สองหลัก เช่น 01, 02, 10

## V1.1.61 — 2026-11-11
- **Cardless Equipment Form Group Headings**: นำกรอบ Card และสีพื้นหลังย่อยออกจากกลุ่มฟิลด์ในหน้าต่าง `แก้ไขข้อมูลทั่วไป`, `แก้ไขคุณลักษณะ` และ `เพิ่มอุปกรณ์` (`.asset-compact-section`) โดยใช้หัวข้อขนาดใหญ่ตัวหนา (`15.5px` Desktop / `16px` Mobile) และระยะห่างกลุ่มที่เรียบง่ายสะอาดตาแทน

## V1.1.60 — 2026-11-11
- **Single-Screen Compact Equipment Edit Dialog**:
  - **จัดระเบียบหน้าต่าง `แก้ไขข้อมูลทั่วไป` และ `เพิ่มอุปกรณ์` ให้พอดีหน้าเดียวโดยไม่ต้องเลื่อน Scroll บน Desktop**: ปรับ `.modal-box:has(.asset-compact-form)` กว้าง `980px`, จัดกลุ่ม **ข้อมูลอุปกรณ์** เป็น Grid 4 คอลัมน์ (2 แถวโดยช่อง **เลขครุภัณฑ์** กว้าง 2 ช่อง), จัดกลุ่ม **ผู้รับผิดชอบและหน่วยงาน** และ **สถานที่ติดตั้ง** อย่างละ 1 แถว (3 คอลัมน์), ลดระยะห่าง (`padding`, `gap`, `margin`, input height `32px`) และ Refactor ด้วย Shared Helpers (`assetSectionHtml_`, `assetGeneralSectionsHtml_`, `assetSpecsSectionHtml_`, `bindAssetEditorDirty_`) ใน `src/UI_Client.html` + `src/UI_Styles.html` (วัดผลใน Chrome Headless ได้ความสูง Modal `475px`, `needsScroll: false`)

## V1.1.59 — 2026-11-11
- **Project Header Rewrite & Unified Project Infrastructure Alignment**:
  - **Rewrite Header ทุกไฟล์ Source Code (`src/*.js`, `src/*.html`)**: ปรับชื่อโครงการใน Header เป็น **`ITSD : ITServiceDesk (ระบบแจ้งซ่อมออนไลน์ และการจัดการครุภัณฑ์ไอที)`** พร้อมปรับค่า Default Branding ใน `Server.js`, `UI_Client.html` และ `Index.html` ให้ตรงกัน
  - **ADMIN Customizable Project Name**: ยืนยันการทำงานของเมนู **ตั้งค่าระบบ** (`saveAdminSettings`) ให้ `ADMIN` สามารถเปลี่ยน `ชื่อโครงการ / ชื่อระบบ`, `ชื่อย่อ` และ `คำอธิบาย` ได้เองตลอดเวลา พร้อมอัปเดตค่าใน `DBS_ITSD` (`APP_SETTINGS`) ทันที
  - **Google Drive & `DBS_ITSD` Folder Sync**: สร้างโฟลเดอร์ `System Assets` (`1Y3V-YsmPBZyRDHPEZoJW3Y-jn32Vq_et`) ภายใต้โฟลเดอร์ `ITSD` (`1fy0Th9kkrcSdfJciTn_C15OMWHkSvOtk`) และอัปเดต `APP_SETTINGS` ใน `DBS_ITSD` (`1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs`) ให้ชี้ไปยังโฟลเดอร์ `Backup Files`, `Documents`, `Pictures` และ `System Assets` ที่ใช้งานได้จริงครบทุกตัว
  - **Full GitHub Documentation Suite**: จัดทำและอัปเดต [`README.md`](./README.md), [`MANUAL_USER.md`](./MANUAL_USER.md), [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) และ [`DATA_DIAGRAM_AND_WORKFLOW.md`](./DATA_DIAGRAM_AND_WORKFLOW.md) (ER Diagram 26 ตาราง + Workflows หลักทั้งระบบ)

## V1.1.54 — 2026-11-11
- **Modular Equipment Tabs & Independent Section Saving (ปรับหน้าต่าง/แถบรายละเอียดอุปกรณ์แยกแท็บและแยกบันทึกตามแท็บ)**:
  - **จัดเรียงลำดับแท็บใหม่ตามที่ระบุ**:
    1. **ข้อมูลทั่วไป (General Information)**: แสดงข้อมูลพื้นฐานอุปกรณ์ ผู้รับผิดชอบ หน่วยงาน และสถานที่ติดตั้ง พร้อมปุ่ม `แก้ไขข้อมูลทั่วไป`
    2. **คุณลักษณะ (Technical Specifications)**: แสดงข้อมูลสเปกทางเทคนิค (OS, CPU, Speed, RAM, Harddisk, IP Address) พร้อมปุ่ม `แก้ไขคุณลักษณะ`
    3. **การสำรวจ (Inspection / Survey)**: แสดงผลการตรวจเช็กและสถานะตรวจสอบครุภัณฑ์ พร้อมปุ่ม `แก้ไขข้อมูลการสำรวจ`
    4. **ประวัติแจ้งซ่อม (Ticket History)**: แสดงรายการประวัติการแจ้งซ่อมของอุปกรณ์ชิ้นนี้
  - **แยกการทำงานและบันทึกแยกส่วนอย่างเป็นอิสระ (Decoupled Modular Saving)**:
    - **แท็บข้อมูลทั่วไป**: หน้าต่าง Modal แก้ไขเฉพาะข้อมูลอุปกรณ์ ข้อมูลหน่วยงาน และสถานที่ติดตั้ง โดยคงค่าคุณลักษณะเดิมไว้ไม่ให้สูญหาย
    - **แท็บคุณลักษณะ**: หน้าต่าง Modal แก้ไขเฉพาะคุณลักษณะทางเทคนิคทั้ง 6 ฟิลด์ และบันทึกผ่าน API `specs_only` โดยไม่รบกวนข้อมูลทั่วไป
    - **แท็บการสำรวจ**: หน้าต่าง Modal แก้ไขเฉพาะข้อมูลการสำรวจและบันทึกผ่าน API `survey_only` อย่างอิสระ
    - **การแจ้งเตือนและการตอบสนอง**: ปรับ Toast Notification และการแสดงผลให้ระบุการบันทึกแต่ละส่วนอย่างชัดเจน เช่น `บันทึกข้อมูลทั่วไปสำเร็จ`, `บันทึกคุณลักษณะสำเร็จ`, `บันทึกข้อมูลการสำรวจแล้ว`

## V1.1.53 — 2026-11-11
- **Clay and Sea Complete Theme Overhaul (นำกลุ่มชุดสี Clay and Sea ออกแบบใช้งานทั้งระบบ)**:
  - **ชุดสีหลัก 5 สี (Clay and Sea 5-Color Harmony)**:
    1. **Terracotta Clay (`#C7522A`)**: สีดินเผา ใช้เป็น Primary Accent สำหรับปุ่มดำเนินการหลัก (CTA), Active states, Brand typography, และไฮไลต์สำคัญ
    2. **Warm Sand Clay (`#E5C185`)**: สีดินทรายอบอุ่น ใช้สำหรับสถานะรอดำเนินการ (Pending/In Progress), เส้นขอบรอง และแถบเน้นข้อความ
    3. **Vanilla Buttercream (`#FBF2C4`)**: สีครีมนุ่มละมุน ใช้สำหรับพื้นผิว Tooltips, การ์ดข้อมูลพิเศษใน Light Mode, และป้ายเตือนแบบ Soft Warmth
    4. **Sage Seafoam (`#74A892`)**: สีเขียวเสจผิวน้ำทะเล ใช้สำหรับสถานะสำเร็จ (Resolved/Complete/Success), ตัวชี้วัดระบบ และสถิติที่เสร็จสมบูรณ์
    5. **Deep Sea Teal (`#008585`)**: สีเขียวอมฟ้าห้วงทะเลลึก ใช้สำหรับโครงสร้างหลักของหน้าต่าง, หัวตาราง (Table Header), เส้นแบ่งหัวเว็บ และ Badge สถิติ
  - **พื้นหลังและมิติ (Backgrounds & Surfaces)**:
    - **Dark Mode / Sidebar**: ใช้สีน้ำเงินทะเลลึก Abyssal Ocean (`#061D22`) และ Deep Sea Navy (`#0B2B30`) ไล่เฉดสีอย่างกลมกลืน
    - **Light Mode**: ใช้พื้นหลังโทนทรายนวลตา Warm Sand Mist (`#FAF7EE`) ลดอาการเมื่อยล้าสายตาและให้ความรู้สึกอบอุ่นระดับพรีเมียม
    - **Continuous Header Line**: เส้นแบ่งหัว Webapp เชื่อมต่อเรียบเนียนระดับ $y = 68\text{px}$ ด้วยสีประกาย Deep Sea Teal (`rgba(0, 133, 133, 0.3)`)
  - **การคงสภาพความปลอดภัย**:
    - ปุ่มออกจากระบบและออกจากหน้าจอ (Sign out / Logout / Exit) ยังคงใช้ **สีแดงบริสุทธิ์ (`#EF4444` / `#DC2626`)** อย่างเคร่งครัดตามมาตรฐานความปลอดภัย

## V1.1.52 — 2026-11-10
- **Equipment Registry & Modal Close Button Overhaul (ปุ่มปิดหน้าต่าง/ลิ้นชัก ทะเบียนอุปกรณ์)**:
  - **สถานะปกติ (Normal)**: ปรับพื้นหลังวงกลมเป็น **สีน้ำเงิน สว่าง (`#2563eb`)** พร้อมไอคอนกากบาทสีขาวบริสุทธิ์ (`#ffffff`) กึ่งกลางวงกลม 100% สอดคล้องกับโทนสีปุ่มการทำงานของระบบ
  - **เมื่อนำเมาส์มาชี้ (Hover / Focus)**:
    - **ใน Dark Mode**: เปลี่ยนเป็น **สีขาวสว่าง (`#ffffff`)** พร้อมแสงเรืองรอบปุ่ม (`box-shadow: 0 0 20px rgba(255, 255, 255, 0.9)`) และไอคอนกากบาทสีน้ำเงินเข้ม คอนทราสต์ชัดเจนมองเห็นง่าย
    - **ใน Light Mode**: เปลี่ยนเป็น **สีสว่างตาม Theme Color** (ไล่เฉดสีส้มเหลืองสดใส `linear-gradient(135deg, #ffc92e, #fa7737)`) ตามชุดสี Style 5 Orange Energy
  - **คงสีแดงสำหรับปุ่มออกจากหน้าจอ (Sign out / Logout / Exit Buttons)**:
    - ปุ่มออกจากระบบและปุ่มออกจากหน้าจอ (`.danger`, `button.danger`, `.ux124-logout`, `.sidebar-signout`, `admin39LogoutAll`) ยังคงใช้ **สีแดงเด่นชัด (`#ef4444` / `#fee2e2` / `#dc2626`)** ตลอดเวลา ไม่ถูกทับด้วยสีน้ำเงิน

## V1.1.51 — 2026-11-09
- **Continuous Straight Header Alignment with System Logo (เส้นแบ่งหัว Webapp เป็นแนวเส้นตรงเดียวกันกับ icon ระบบ Sidebar)**:
  - Synchronized the Webapp header (`.topbar`) and sidebar brand header (`.brand`) to share the exact same standardized height (`--topbar-height: 68px`).
  - Unified the dividing bottom border (`border-bottom: 1px solid rgba(250, 119, 55, 0.35) !important; box-sizing: border-box !important; margin: 0 !important;`) across both `.brand` and `.topbar`, creating an unbroken, perfectly continuous horizontal straight line at $y = 68\text{px}$ from the left edge of the sidebar across to the right edge of the topbar.
  - Aligned the bottom dividing line cleanly right beneath the system logo icon (`.brand .logo`), matching the yellow line reference geometry.
  - Ensured both expanded and collapsed sidebar states (`.sidebar.is-collapsed .brand`) maintain the exact same height and border alignment without any stepping or vertical offset.
  - Cleaned up legacy conflicting styles (`82px`, `80px`) across the CSS cascade to guarantee a single consistent source of truth.

## V1.1.50 — 2026-11-09
- **Bright Luminous Selection for All Status & Action Icons (พื้นหลังสว่างรอยืนยันคลิกเลือก)**:
  - Applied crisp, high-contrast bright circular background highlights when hovering or focusing across:
    - Close cross buttons (`.ux-drawer-close`, `.modal-head button`, `.ocpb-import-close`, `.admin36-detail-head button`).
    - Light / Dark Mode toggles (`#themeToggle`, `.mode-toggle`).
    - Notifications bell toggle (`#uxNotificationButton`, `.top-icon-button`).
    - Theme Palette cycle button (`#paletteToggle`, `.palette-toggle`).
    - Sidebar collapse & mobile menu toggles (`.sidebar-collapse`, `.mobile-menu`).
    - Password visibility toggle (`.login48-password-toggle`).
  - **Dark Mode**: When hovered or focused, the button illuminates with a bright white circular background (`#ffffff`), glowing halo (`box-shadow: 0 0 18px rgba(255, 255, 255, 0.65)`), and vivid Energy Orange icon (`#fa7737`), giving unmistakable visual confirmation.
  - **Light Mode**: Highlights with a clean white circle, prominent orange outline (`0 0 0 2px #fa7737`), and deep shadow.
  - Active pressed state: subtle scale (0.94) and warm peach tint.

## V1.1.49 — 2026-11-09
- **Precision Centering of Close & Icon Buttons (กากบาทอยู่กึ่งกลางสมบูรณ์ 100%)**:
  - Eliminated the 4px horizontal offset caused by legacy `button .material-symbols-rounded { margin-right: 4px; }` across all icon buttons.
  - Implemented geometric grid-centered layout (`display: inline-grid !important; place-items: center !important;`) for both `.ux-drawer-close` and all circular icon buttons.
  - Explicitly reset icon child dimensions and margins (`width: 20px; height: 20px; margin: 0 !important; font-size: 20px; line-height: 20px;`) ensuring mathematical subpixel centering across Retina and standard displays.
- **Theme Color Integration (พื้นหลังและสีปุ่มอ้างอิงตาม Color Theme ที่เลือก)**:
  - Button hover and active states now dynamically reference the active theme's accent color (`color-mix(in srgb, var(--theme-accent) 14%, transparent)` in light mode, `color-mix(in srgb, var(--theme-accent) 22%, transparent)` in dark mode).
  - On hover, the close icon turns into the active theme accent color (`var(--theme-accent, #fa7737)` in Orange Energy Style 5), replacing generic grey with vibrant theme-conscious styling.
  - Active/pressed state applies deeper theme tint (`color-mix(in srgb, var(--theme-accent) 26%, transparent)`) with 0.92 scale.
- **Side Drawer Header & Active Tab Theme Alignment**:
  - Aligned drawer header items to `align-items: center` for clean vertical centering between title metadata and the close button.
  - Replaced legacy blue underline (`#075de6`) on `.ui-side-tabs button.active` with `var(--theme-accent, #fa7737)` in Light Mode, perfectly matching the Orange Energy theme.
- Deployed to Google Apps Script as Version `@9`.

## V1.1.48 — 2026-11-09
- **Fixed Duplicate Close Buttons on Inventory Registry**: Resolved the issue where the equipment registry drawer (`inventorySide`) rendered two close buttons simultaneously by removing the duplicate `<button class="ghost">` and standardizing on the unified `.ux-drawer-close`.
- **Universal Circular Icon Button Interaction System**:
  - Implemented the user's reference design (Images 1, 2, 3):
    - **Normal State**: Only the icon is shown with transparent background, no borders, perfectly centered.
    - **Hover State**: Displays a dark circular hover selection ring (`border-radius: 50%`, `rgba(15, 23, 42, 0.08)` in light mode, `rgba(255, 255, 255, 0.14)` in dark mode).
    - **Active State**: Smooth scale down to 92% with deeper contrast tint.
  - Applied this interaction pattern universally across:
    - All modal, panel, and drawer close buttons (`.modal-head button`, `.ux-drawer-close`, `.ocpb-import-close`, `.admin36-detail-head button`).
    - Expand / Collapse / Menu toggles (`.sidebar-collapse`, `.mobile-menu`).
    - More options actions (`.admin36-role-more`, `.top-icon-button`, `#themeToggle`, `.palette-toggle`, `.mode-toggle`).
    - Password visibility toggle (`.login48-password-toggle`).
- Deployed to Google Apps Script as Version `@8`.

## V1.1.47 — 2026-11-09
- **Password Eye Icon Toggle**: Configured `visibility_off` as the default icon for password input when masked. Clicking changes to `visibility` (open eye) and reveals password in plaintext; clicking again reverts to `visibility_off` and masks password.
- **Top Line Continuous Alignment (ตรงตำแหน่งเส้นเหลือง)**: Perfectly aligned the bottom border of `.brand` and `.topbar` at identical heights (`var(--topbar-height)`) with matching `rgba(250, 119, 55, 0.3)` border separators across the entire screen width, eliminating vertical offsets between the sidebar header and topbar.
- **Sidebar Theme 5 (Orange Energy)**: Replaced legacy royal blue with Style 5 Orange Energy palette:
  - Sidebar Brand Logo: `linear-gradient(135deg, #FA7737, #FFC92E)` with white icon.
  - Active Menu Buttons: `linear-gradient(90deg, #FA7737, #EA580C)` with Golden Amber `#FFC92E` left border accent.
  - Menu Hover States: warm orange glow `rgba(250, 119, 55, 0.14)` with `#FFC92E` text.
  - Section Headers: Warm Peach `#FD9E76`.
- **Role Cards & Permission Matrix Overhaul**:
  - Role Summary Cards (Admin: `#FA7737`, Manager: `#55E07E`, Technician: `#FFC92E`, ITSupport: `#FD9E76`, User: `#7E879B`).
  - Active Role Card: styled with Style 5 Orange gradient and elevated border glow.
  - Role List Active Item: replaced legacy dark blue with `linear-gradient(135deg, rgba(250, 119, 55, 0.28), rgba(234, 88, 12, 0.18))` and `#FA7737` badge.
  - Permission Matrix Table: replaced bright blue checkmarks with Orange Energy gradient badges (`linear-gradient(135deg, #FA7737, #EA580C)`).
  - Topbar Search Button: styled with Orange Energy `#FA7737` gradient and white typography.
- Deployed to Google Apps Script as Version `@7`.

## V1.1.46 — 2026-11-09
- Applied Pro Style 5: "Orange Energy" (Active • Friendly • Exciting) color palette across the entire ITSD Web App.
- Core brand palette: Primary Energy Orange (#FA7737), Golden Amber (#FFC92E), Warm Coral Peach (#FD9E76), Deep Midnight Navy (#051344), and Fresh Mint (#55E07E).
- Modernized Dashboard KPI cards with 16px border-radius, soft elevation hover, and Deep Midnight Navy contrast typography.
- Professional Midnight Navy (#051344) Enterprise sidebar navigation with glowing Energy Orange active pills and amber hover states.
- Enhanced CTA buttons with orange gradient (linear-gradient(135deg, #FA7737, #F97316)) and warm drop shadows.
- Updated COLOR_TEMPLATE.md, deployed as Apps Script Version @6, and committed to GitHub repository.

## V1.1.45 — 2026-11-09
- Verified and reconciled exact source code against the live uploaded Server bundle (Server.zip).
- Database readiness check: confirmed all 26 standard production sheets are active in DBS_ITSD (1JtOd13gEJpwqPlaBJy87hGrUa1hO_MnVmmKRAaoAyEs).
- Security & RBAC: verified APP_ROLES, APP_ROLE_PERMISSIONS, and APP_ROLE_ACTION_PERMISSIONS.
- User authentication initialized: ADMIN, CHALOEM, MANAGER, TECHNICIAN, and ITSUPPORT set with verified SHA-256 salted credentials.
- Login screen specifications: User icon [person] for Username, Key icon [key] for Password, bidirectional eye state toggle, Patch Update badge ITSD V1.1.45, and developer credit Create by : LongZe Design.
- Deployed as Apps Script Version @4 and synced to GitHub repository.

## V1.1.01 — 2026-10-29
- ปรับไอคอนและพื้นที่กด แถบค้นหา ฟอร์ม เมนู กราฟ และการเลื่อนบน Mobile
- รองรับ viewport 393×852, 375×812, 360×800 และ 360×640 CSS px
- สถานะ: Local Patch; ยังไม่ได้ push หรือ deploy
- รายงาน: .patch-reports/mobile-V1.1.01-20261029/README.md

## V1.1.02 - 2026-10-29
- Fix survey report mobile date controls: match other filter fields at 44 CSS pixels, constrain width and normalize native date appearance.
- Keep native date picker and existing filter behavior.
- Deployed as Apps Script version 49 at the existing web-app URL after three verification passes.

### Included in V1.1.02: brand/model master data
- Added MST_DEVICE_MODELS and migrated 107 unique complete legacy type/brand/model combinations; 13 incomplete legacy rows remain untouched in INVENTORY.
- Master Data > Device Models supports search/filter, add/edit, deactivate and reactivate.
- Equipment model options depend on both type and brand. Historical inactive selections remain readable and unchanged.
- Role permissions, duplicate validation, audit logging, schema validation and referenced-name protection run on the server.
- Live database tab verified. Eight app files pushed, read back and deployed as version 49; production smoke checks passed.

### Final pre-deployment fix
- Ignore and reuse checkbox-only empty model rows; 29 server regression cases and 158 browser checks passed.
- Production V1.1.02: 107 catalogue records, no empty catalogue rows, mobile date controls 44px.

## V1.1.03 - 2026-10-29
- Fixed empty Brand tab: APP_LOOKUPS had no BRAND records although inventory contained 26 distinct brands.
- On Master Data access by a user with CREATE permission, register missing inventory brands under the script lock. Deduplicate normalized names, keep inactive records inactive, preserve inventory, and audit additions.
- Deployed as Apps Script version 50 at the existing URL after three verification passes.

## V1.1.04 - 2026-10-29
- Move survey inspector filter after the end date, as the final filter before action buttons.
- Chrome/WebKit checks passed; pushed and deployed as Apps Script version 51 at the existing URL.

## V1.1.05 - 2026-10-29
- Constrain service report date fields to their grid cells and align all filter controls/buttons at 44px.
- Pair dates in a responsive filter grid; preserve native date picking and filter behavior.
- Verified 48 Chrome/WebKit cases; deployed as Apps Script version 52 at the existing URL.

## V1.1.06 - 2026-10-29
- Compact service report desktop filters and actions into one row with 40px controls; retain mobile 44px layout.
- Narrow desktop content can scroll the filter row horizontally instead of wrapping; contain the status chart legend in its panel.
- 52 Chrome/WebKit layout checks passed; deployed as Apps Script version 53 at the existing URL.

## V1.1.07 - 2026-10-29
- Survey report filters reordered: dates, type, brand, main unit, sub-unit, status, surveyor. Added backend brand/sub-unit filtering and updated export labels/summary.
- Inventory filters reordered with dependent sub-units; PC-style asset number and UPS digit entry auto-format, preserve leading zeroes and support normalized partial searches and clipboard/editing.
- Debugged in two passes: 73 logic cases and 120 Chrome/WebKit browser cases passed.
- Pushed eight files, matched deployed source hashes, deployed Apps Script version 54 at the existing URL and confirmed production V1.1.07.

## V1.1.08 - 2026-10-29
- Fix overlapping survey/inventory filter captions and controls: place labels above fields with consistent spacing.
- Verified twice, including 104 Chrome/WebKit responsive cases; pushed 8 files and updated existing deployment to Apps Script version 55.
- Immutable deployed source matches local SHA256 for all 8 files.

## V1.1.09 - 2026-10-29
- Desktop survey: halve inspector width and divide recovered width equally between device type and brand.
- Two verification rounds; 104 Chrome/WebKit responsive cases passed, redistribution measured.
- Pushed and deployed existing URL as version 56; 8 source hashes and public V1.1.09 footer verified.

## V1.1.12 - 2026-10-30
- Complete user-role summary including Manager, separate Technician/IT Support/User and roles supplied by server or existing accounts.
- Verified two rounds; pushed 8 files and deployed existing URL version 59. Immutable source hashes match Local.

## V1.1.13 - 2026-10-30
- User groups reuse permission role cards: same code/order/colors/icons/descriptions and separate Technician/IT Support counts.
- Click a group to toggle the user role filter; preserve total and active counts as text.
- Two verification rounds passed; deployed existing URL as version60, 8 source hashes match local.

## V1.1.14 - 2026-10-30
- Survey chart legend replaces Other with Total Equipment, using summary.total from the scoped equipment KPI. Donut segments/percent calculation unchanged.
- Syntax and exact-diff/total/zero checks passed; deployed existing URL version61; all 8 immutable source files match local.

## V1.1.15 - 2026-10-30
- Audit history desktop filter toolbar fits one row with proportional search, compact date/select fields and 40px controls.
- Two verification rounds passed; deployed version62 at existing URL; immutable 8 source files match Local.

## V1.1.16 - 2026-10-30
- Center all four survey KPI glyphs inside their colored containers; separate icon font span from grid container.
- Two checks passed (syntax and browser center geometry); deployed version63 at existing URL, 8 source files match Local.

## V1.1.17 - 2026-10-30
- Keep permission matrix buttons circular (44x44) and state glyphs centered (24x24) on Mobile/Desktop.
- Two rounds passed including Chrome/WebKit geometry for all three states and editable/disabled styles in light/dark.
- Deployed existing URL version64; source8/8 matches Local.

## V1.1.18 - 2026-10-30
- Add ADMIN-only เปลี่ยนรหัสผ่าน NIST tab after แม่แบบใบงาน: configurable one-time campaign, Thai start time, notification and explicit new-round action. Default campaign disabled, starts 1 Nov 2026 00:00 Asia/Bangkok when enabled.
- Enforce password change server-side before normal bootstrap/API access; after success revoke all sessions and record completion for the current campaign. Administrative temporary passwords also require change. No periodic expiry; new passwords15..128 and cannot match current/common weak entries.
- Save policy requires ADMIN + SETTINGS/MANAGE + current-password reauthentication and revision validation. Audit changes without recording credentials.
- Two rounds passed: 58 backend checks, actual refresh gate, Chrome/WebKit responsive and form-flow tests. Deployed version65 at existing URL; 8 source files match local and live public footer V1.1.18 verified. Campaign not enabled by deployment.


## V1.1.20 - 2026-11-02
- Restore separate survey KPI icon wrappers after V1.1.19 source regression; center all four glyphs in fixed square color blocks with scoped flex layout.
- Show compact 32px color blocks with 20px glyphs on mobile; retain 44px/24px on larger screens and prevent flex shrink.
- Validation: JavaScript syntax and manifest parsing; actual survey renderer geometry in Chrome/WebKit across mobile and desktop sizes and light/dark themes.


## V1.1.21 - 2026-11-02
- LINE review uses asset numbers as visible input and search key, including partial numbers, Thai digits and separator-free input. Persist existing internal asset IDs for API compatibility.
- Exact unique number may resolve automatically; duplicate numbers require selecting the machine using model, serial and owner. Show selected details below the picker, including on mobile. No-asset/software mode retained.
- Two rounds passed: syntax/manifest and 12 Chrome/WebKit mobile/desktop interaction scenarios.


## V1.1.22 - 2026-11-02
- User rows now sort ADMIN, MANAGER, TECHNICIAN, ITSUPPORT, USER, followed by custom roles; ties use Thai display-name order, username and ID. The role filter follows the same role sequence.
- Add ADMIN-only จัดการวันหยุด settings tab before แม่แบบใบงาน with date ranges, holiday/special holiday/announcement types, active toggle, create/edit/soft delete. Entries use APP_HOLIDAYS, initialized only on the first save; no official holiday dates are assumed or seeded. SETTINGS VIEW/MANAGE and ADMIN required server-side; revisions, schema/date validation and audit protect writes.
- PM month API returns active overlapping entries. Calendar cells show light red for government/special holidays (takes precedence over weekends), gray for Saturdays/Sundays, and text for ordinary announcements. Existing PM cards and drag/drop remain available.
- Two checks: syntax/manifest/backend assertions and Chrome/WebKit responsive interaction tests.


## V1.1.23 - 2026-11-02
- Replace LINE review asset dropdown/datalist with a four-column clickable table: asset number, brand, model, owner. Search remains based on the asset number; stored selections retain the internal ID for API compatibility.
- Multiple matches require explicit row selection; highlight selected row and support radio keyboard navigation. Mobile table scrolls horizontally within its container with an explanatory hint. Existing no-asset/software mode and org autofill preserved.
- Two verification rounds: syntax/manifest and 12 Chrome/WebKit interaction scenarios across iOS/Android/desktop viewport sizes, light/dark, duplicate/partial/invalid searches, payload stability, escaping and no-asset mode.


## V1.1.24 - 2026-11-02
- Profile logout button has a visible 2px red border with scoped light/dark hover and keyboard-focus treatment; logout behavior unchanged.
- Restore native brand-reference tab title BRANDING to Branding (sheetId 2118943160), matching brandingBrandCatalog_ reference. All native cells/format/validation preserved and verified; code catalogue reader tested against freshly read live Branding and MST_DEVICE_MODELS data.
- Tracking table hides the ticket-number column and displays report date, asset number, brand, model, equipment, status, queue and details. Brand/model are included in the permission-filtered ticket payload from the INCIDENT snapshot; missing historical values show a dash. Ticket IDs remain internal for search and detail actions.
- Validation: syntax/manifest, backend catalogue/payload assertions and Chrome/WebKit desktop/mobile interaction checks.


## V1.1.25 - 2026-11-02
- Add read-only รายละเอียดคำขอ / อาการเสีย above the status-update fields, separate from the repair resolution. Preserve original line breaks, escape HTML and wrap/scroll long text on mobile. Missing descriptions show an explicit fallback.
- Original description is not added to the status-save payload; permissions, status requirements, attachments, and the service-report wrapper remain unchanged.
- Two rounds passed: syntax/manifest and unchanged server behavior; 12 Chrome/WebKit desktop/mobile scenarios covering description/escaping/newlines/long/empty content, assignment/resolution validations, stable save payload, permission gate and service-print integration.


## V1.1.26 - 2026-11-03
- Normalize branding image uploads to PNG after browser decoding; fixes WebP images saved with a JPG extension. Recheck square/minimum dimensions, bound output to 1024px, and retain server validation.
- Actual customer-service.jpg regression and seven format/size/error cases pass in Chrome and WebKit (16 total).


## V1.1.27 - 2026-11-03
- Compact ticket detail drawer: reduce row/header/section spacing, widen desktop drawer to 520px, retain full text and multiline notes.
- Chrome/WebKit desktop/mobile light/dark checks passed (12 cases); screenshot fixture fits in one window without hiding fields.


## V1.1.28 - 2026-11-03
- Use account_circle as the default system branding icon in login, sidebar, login progress, settings preview and reset behavior.


## V1.1.29 - 2026-11-03
- Balance ticket drawer spacing: desktop 14px body text, comfortable row gaps and 500px width. Drawer height follows content with a viewport cap and scrolling for long records; mobile keeps compact full-height behavior.


## V1.1.30 - 2026-11-03
- Compact Desktop status dialog with reduced row spacing, paired resolution/notes and smaller attachment selector. Standard Desktop fixture fits without dialog scrolling; original request text remains complete.
- Chrome/WebKit light/dark at four Desktop sizes and one mobile size passed (20 cases), including assignment/resolution requirements.


## V1.1.31 - 2026-11-03
- Status dialog footer places attachments left and actions right on Desktop; compact Mobile form with 44px action targets.
- Apply six-color reference palette to overview cards and shared icon backgrounds in light/dark; update five overview labels while preserving metric calculations. COLOR_TEMPLATE.md records reusable colors.
- Status layout: 28 Chrome/WebKit responsive/theme cases passed. Palette: 12 responsive/theme cases passed.


## V1.1.32 - 2026-11-03
- Remove six-color overrides from Google Fonts glyphs and shared icon containers; glyph backgrounds are transparent. Retain overview card colors and readable KPI icons in light/dark.
