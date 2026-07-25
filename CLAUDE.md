# Neelkanth Global Wellness (NGW) — Project Guide (CLAUDE.md)

> Read this first, every session. It is the source of truth for project context,
> conventions, and confirmed decisions. Keep it updated as each module lands.

## What this is

**Corporate website + full ecommerce store** for **Neelkanth Global Wellness
(NGW)** — an Ayurvedic products company with a distributor/MLM model
(ngwellness.in). India-based, **single vendor** (no marketplace).

- **Backend** (being built): Node.js + Express + MongoDB (Mongoose). Lives in `server/`.
- **Frontend** (pre-existing scaffold): React + Vite. Lives in `client/`.

The two are kept separate: the backend has its own `package.json` inside
`server/` and never shares dependencies with the Vite frontend. A root
`package.json` provides combined dev scripts via `concurrently`.

---

## Confirmed full-project scope

These are locked decisions for the whole build. Not all are built yet — this is
the target. **Do not build features listed under OPEN DECISIONS until resolved.**

### Storefront / corporate pages

- **Home** — hero slider (admin-managed banners), featured products, health
  concerns grid, certifications, testimonials, offers, best sellers, all
  products, latest blogs, contact strip, floating WhatsApp/call buttons.
- **About** — company history, vision/mission, products & sourcing,
  manufacturing/facility, director's message, infrastructure, certifications,
  awards.
- **Product catalog** — browsable by **categories** AND **health-concern tags**
  (disease-wise browsing).
- **Product detail** — HD images, product videos, ingredients, benefits, dosage,
  FAQ, related products, wishlist, add-to-cart, buy-now.
- **Contact page.**
- **Business Opportunity** — distributor / franchise / NGW info (static +
  possibly a lead-capture form). Copy must avoid income guarantees.
- **Downloads** — catalogue PDF, price list, certificates, company profile,
  brochures. Admin-uploadable documents.
- **Image & Video Gallery** — admin-managed media showcase.
- **Events** — admin-managed event listings (upcoming + past).
- **Awards** — admin-managed awards/recognition entries.
- **Press Releases** — admin-managed press/news items.
- **Blog** — admin-managed blog posts with categories/tags.

### Product categories (confirmed list)

Joint Care, Diabetes Care, Asthma Care, Kidney Care, Liver Care, Hair Care,
Weight Management, Women's Health, Men's Health, Immunity, Digestive Care,
Personal Care, Herbal Supplements.

### Health-concern tags (disease-wise browsing)

Joint pain, arthritis, slip disc, sciatica, cervical, diabetes, asthma, kidney,
liver, hair, weight loss, women's health, men's health, immunity, migraine,
cholesterol, acidity, piles, fatty liver, PCOD/PCOS, sexual wellness.

> **Compliance:** this is a browsing structure, not a claim of cure. Visible copy
> uses "health concern" framing — see compliance section below.

### Auth & accounts

- **Customer auth:** email/password + email OTP verification. Guest checkout also
  supported (see below).
- **Admin auth:** two-tier roles — `developer` + `client`. No self-registration.
- **Security:** SSL (hosting), OTP login, role-based access, rate limiting,
  failed-login lockout.
- **Vendor model:** single vendor, no marketplace.
- **No** prescription / consultation flow.

### Products

- Detailed listings: dosage, ingredients, usage, benefits, FAQ, product videos.
- Browsable by categories AND health-concern tags.
- **Product verification via QR code** — each product gets a unique QR; customer
  scans to verify authenticity.
- **NO** product variants (each pack size is a separate product).
- **Recently viewed** — client-side (localStorage) or server-side tracked list.

### Search & filtering

- Full-text search with filters: price range, category, health concern, form.
- Rate-limited (60/min). MongoDB text index.
- **NO** AI search, **NO** "advanced search" as a standalone portal.

### Cart & checkout

- **Cart** — logged-in users. Stock-validated, stale-item flagging.
- **Guest checkout** — allows placing an order without registration. Collects
  email + shipping info at checkout. Account created post-order (optional) or
  order linked to email for tracking.
- **Coupons** — customer can apply a discount code at checkout (validated against
  Coupon model rules). Admin-managed via admin panel.
- **Wishlist / save-for-later** (logged-in only).
- Shipping: free ≥ ₹1000, flat ₹160 below. Pan-India, no pincode restriction.

### Payments

- **Exactly ONE online gateway** — PhonePe **OR** Razorpay (pending
  confirmation). Exposes UPI / card / netbanking through that single gateway.
- **COD** — confirmed via email OTP.
- **No** wallet, **no** separate multi-gateway integration, **no** EMI unless
  the chosen gateway provides it natively at no extra integration cost.

### Orders

- Manual status updates by admin; customer can cancel before dispatch.
- Order tracking (status history visible to customer).
- **Stock:** decremented at **order placement** (not payment success).
  Low-stock alerts + auto out-of-stock.

### Notifications

- **Email only.** Includes abandoned-cart email, order confirmations, status
  updates, OTP.
- **NO** in-app notification centre, **NO** push notifications.

### Invoice

- **GST invoice PDF:** GSTIN, HSN code, CGST/SGST vs IGST split based on buyer
  state vs seller state, pickup address, invoice numbering (FY reset).
- Customer can download invoice from dashboard.

### Customer dashboard

- Profile (name, phone — email immutable).
- My orders (list + detail + download invoice + initiate return).
- Wishlist.
- My reviews (submitted reviews, status: pending/approved/rejected).
- Delivery address (single, editable).
- **NOT** reward points, **NOT** wallet, **NOT** in-app notification centre.

### Admin panel

- Dashboard (overview stats).
- Product management (CRUD, images, stock, featured).
- Order management (status updates, search, filters).
- Customer management (list, block/unblock).
- Inventory management (stock levels, low-stock alerts).
- Banner management (hero slider, promo banners).
- Blog management (CRUD, publish/draft).
- Content management: downloads, gallery, events, awards, press releases.
- Reports & analytics (sales, orders, inventory reports).
- User/admin management (create/manage admin accounts).
- Website settings (contact info, shipping rates, SEO defaults).
- **Two admin roles:**
  - `developer` — bulk CSV import, bulk edit, raw access, all settings.
  - `client` — guided single-product add, orders, inventory, featured toggle,
    content management.

### SEO

- Friendly URLs (slugs for products, categories, blog posts, tags).
- Meta title + description (admin-editable per page/product).
- Schema markup (Product, BreadcrumbList, Organization, Article).
- XML sitemap (auto-generated), robots.txt, canonical URLs, Open Graph tags.
- Image optimization (Cloudinary auto-format/quality), lazy loading, fast
  performance.

---

## Explicitly OUT of scope (do not build)

- Doctor portal / find-a-doctor / consultation booking / doctor dashboard.
- Director's message as a separate page (lives within About page only).
- Compare products feature.
- Wallet / reward points.
- In-app notification centre.
- Ayurvedic knowledge library / health articles / tips / success stories /
  "latest news" as a separate section (blog covers editorial content).
- Video training academy.
- Media center as a portal.
- Live chat.
- Multi-language support.
- Google reCAPTCHA (as an app feature — may be added at hosting/CDN layer).
- Daily backup (as an app feature — hosting responsibility).
- Firewall (as an app feature — hosting/WAF responsibility).
- WhatsApp Business API integration (simple `wa.me` link is fine — not an API
  integration).
- AI-powered search.
- "Advanced search" as a standalone portal (standard search + filters is kept).

---

## Resolved scope decisions (2026-07-18)

Previously locked as OUT, now confirmed IN after client's full feature list:

### Reviews & Ratings — NOW IN

- Any logged-in user can submit a review (rating 1–5 + text).
- Customers with a delivered order containing that product get a **"Verified
  Purchase"** badge. Others can still review but without the badge.
- Admin moderation: reviews require approval before appearing publicly.
- Per-product aggregation: average rating + review count displayed on product
  cards and detail pages.
- Module 27 in roadmap.

### Returns & Refunds — NOW IN

- Customer can initiate a return request within a configurable window (e.g. 7
  days of delivery).
- Admin approves or rejects the request.
- Refund path: gateway API refund for prepaid orders; manual/bank-transfer
  process for COD.
- ReturnRequest model with status tracking (requested → approved → refund
  processed / rejected).
- Module 28 in roadmap.

### Coupons & Discounts — NOW IN

- Coupon model: code, discount type (flat ₹ / percentage), value, min order
  amount, max discount cap, expiry date, usage limits (total + per-user),
  active/inactive toggle.
- Customer applies code at checkout; validated against all rules.
- Admin CRUD for creating/managing coupons.
- Module 29 in roadmap.

### Address — SINGLE (no change)

- **Keep single address per user.** Module 7 stays as-is. No rework.
- Client's "saved addresses" interpreted as the existing single-address feature.

### Search — KEEP full-text + filters (Module 5 unchanged)

- "Drop advanced search" = drop AI search only.
- Existing full-text search + filters (category, health concern, price, form,
  in-stock) is confirmed and already built.

### Content modules — ALL IN for this build

All seven content features are in scope for launch (not deferred):
product videos, downloads, image/video gallery, events, press releases,
blog (full), QR product verification.

---

## Compliance notes

These rules apply across all modules, frontend copy, and admin-entered content.

1. **No medical/curative claims** — regulated in India (Drugs & Magic Remedies
   Act, ASCI guidelines). Use "traditionally used for" / "supports" / "promotes"
   framing. "Disease-wise browsing" is a navigation structure, not a claim that
   products cure diseases. Never write "cures X" or "treats Y."

2. **Certifications: logos only** — no license numbers on any public page.
   GSTIN appears only on invoices. Certification badges (AYUSH, GMP, ISO) shown
   as visual logos with names, never with registration/license numbers.

3. **MLM / business-opportunity copy** — must avoid income guarantees or
   earnings claims unless the client supplies compliant, independently verified
   wording. Default to factual statements about the business model.

4. **Ops (backup, firewall, SSL)** — these are hosting/infrastructure
   responsibilities, NOT app features. Production hosting must still provide:
   daily backups, WAF/firewall, SSL termination. The client should NOT interpret
   "dropped from app scope" as "no backups exist."

5. **WhatsApp** — a simple `wa.me/{number}` click-to-chat link is acceptable.
   WhatsApp Business API integration (automated messages, chatbots, order
   notifications via WA) is out of scope.

---

## Module roadmap (revised)

Modules 1–7 are COMPLETE (see status below). The remaining modules incorporate
the expanded scope. **Modules marked with ⚠️ depend on open decisions.**

| # | Module | Scope | Status |
|---|--------|-------|--------|
| 1 | Project setup & schemas | Express, folder structure, DB, env, all base schemas | COMPLETE |
| 2 | Authentication | Customer + admin auth, JWT, OTP, rate limiting, seed | COMPLETE |
| 3 | Categories & Health Tags | Admin CRUD, public endpoints, taxonomy factory | COMPLETE |
| 4 | Products (Admin CRUD) | CRUD, images (Cloudinary), stock, featured, roles | COMPLETE |
| 5 | Public Product Listing & Search | List, search, featured, filters, detail, related | COMPLETE |
| 6 | Cart & Wishlist | Cart CRUD + totals, wishlist + move-to-cart, stock validation | COMPLETE |
| 7 | User Profile & Address | Profile, password, single address, order history | COMPLETE |
| 8 | Order Placement & Payment | Checkout flow, guest checkout, stock decrement, gateway (PhonePe/Razorpay TBD), COD OTP | NOT STARTED |
| 9 | Order Management (Admin) | Status updates, order list/search/filter, cancellation | NOT STARTED |
| 10 | Invoice PDF | GST invoice generation, FY numbering, download endpoint | NOT STARTED |
| 11 | Email Notifications | Templates: order confirm, status update, abandoned cart, welcome | NOT STARTED |
| 12 | Admin Dashboard & Reports | Stats overview, sales/order/inventory reports | NOT STARTED |
| 13 | Customer Management (Admin) | Customer list, block/unblock, search | NOT STARTED |
| 14 | Website Settings (Admin) | Contact info, shipping config, SEO defaults, social links | NOT STARTED |
| 15 | Bulk Operations (Developer) | CSV import/export, bulk edit, bulk stock update | NOT STARTED |
| 16 | Blog (full build) | BlogPost model (scaffolded), categories/tags, admin CRUD, public list/detail, SEO | NOT STARTED |
| 17 | Downloads & Documents | Download model, admin upload (PDF/images), public list by type | NOT STARTED |
| 18 | Image & Video Gallery | Gallery model (images + videos), admin CRUD, public gallery page | NOT STARTED |
| 19 | Events | Event model, admin CRUD, public list (upcoming/past) | NOT STARTED |
| 20 | Awards & Press Releases | Award + PressRelease models, admin CRUD, public pages | NOT STARTED |
| 21 | Product Videos & FAQ | Video URLs per product, FAQ per product (admin-editable) | NOT STARTED |
| 22 | QR Product Verification | Unique QR per product/batch, public verify endpoint, admin generation | NOT STARTED |
| 23 | Guest Checkout | Order without account, email-based tracking, optional registration | NOT STARTED |
| 24 | Recently Viewed | Client-side (localStorage) recently viewed products | NOT STARTED |
| 25 | SEO & Performance | Sitemap generation, schema markup, OG tags, robots.txt, meta admin | NOT STARTED |
| 26 | Hero Banners & Testimonials | Admin CRUD for homepage banners + testimonials (partially scaffolded) | NOT STARTED |
| 27 | Reviews & Ratings | Review model, any-user + verified-purchase badge, admin moderation, aggregation | NOT STARTED |
| 28 | Returns & Refunds | ReturnRequest model, customer initiation, admin approval, gateway/manual refund | NOT STARTED |
| 29 | Coupons & Discounts | Coupon model (flat/%), validation rules, checkout integration, admin CRUD | NOT STARTED |

> **Note:** Module numbering is for reference only. Build order will be
> prioritised based on dependencies (e.g., Module 8 before 9/10/11). Guest
> checkout (23) is merged into Module 8's checkout flow. Module 30 (Multiple
> Addresses) was DROPPED — single address confirmed.

## Backend conventions

### Folder structure (`server/`)

```
server/
├── package.json          # ESM ("type": "module"), Node >= 20
├── .env                  # local secrets (gitignored)
├── .env.example          # documented template of every env var
└── src/
    ├── server.js         # process entry: connect DB, start HTTP, graceful shutdown
    ├── app.js            # builds/configures Express app (no listen) — importable for tests
    ├── config/
    │   ├── env.js        # loads + VALIDATES env vars; throws on missing/malformed
    │   ├── db.js         # Mongo connect w/ bounded exp-backoff retry + reconnect logging
    │   └── cloudinary.js # Cloudinary SDK config (Module 4)
    ├── middleware/
    │   ├── requestLogger.js  # one line per request on finish (method, path, status, ms)
    │   ├── notFound.js       # 404 -> ApiError -> error handler
    │   ├── errorHandler.js   # global handler; normalises all errors to one envelope
    │   ├── auth.js           # customer auth: verify Bearer JWT, attach req.user
    │   ├── adminAuth.js      # admin auth: verify admin JWT, attach req.admin + requireRole()
    │   ├── rateLimiter.js    # authLimiter (10/15min) + searchLimiter (60/min)
    │   └── upload.js         # multer memory storage for image uploads (Module 4)
    ├── utils/
    │   ├── logger.js         # tiny dependency-free leveled logger (swap for pino later)
    │   ├── ApiError.js       # operational error w/ statusCode + static factories
    │   ├── ApiResponse.js    # success envelope + .send(res, status)
    │   ├── asyncHandler.js   # wraps async routes, forwards rejections to next()
    │   ├── tokens.js         # JWT sign/verify, refresh token generation + hashing
    │   ├── otp.js            # OTP generation, bcrypt hashing/verification, cooldown
    │   ├── email.js          # nodemailer transporter + sendVerificationOtp, sendPasswordResetEmail
    │   └── slugify.js        # shared slug generator (used by Product, Category, HealthTag)
    ├── models/
    │   └── index.js      # barrel: models exported here as each schema is finalised
    ├── routes/
    │   ├── authRoutes.js      # customer auth routes under /api/v1/auth
    │   ├── adminAuthRoutes.js # admin auth routes under /api/v1/admin/auth
    │   ├── categoryRoutes.js  # category routes under /api/v1/categories
    │   ├── healthTagRoutes.js # health tag routes under /api/v1/health-tags
    │   ├── productRoutes.js        # admin product routes under /api/v1/admin/products
    │   ├── publicProductRoutes.js # public storefront routes under /api/v1/products
    │   ├── cartRoutes.js          # cart routes under /api/v1/cart
    │   ├── wishlistRoutes.js      # wishlist routes under /api/v1/wishlist
    │   └── profileRoutes.js       # profile/address/order-history under /api/v1/profile
    ├── controllers/
    │   ├── authController.js            # customer auth request handlers
    │   ├── adminAuthController.js       # admin auth request handlers
    │   ├── categoryController.js        # category CRUD handlers
    │   ├── healthTagController.js       # health tag CRUD handlers
    │   ├── productController.js         # admin product CRUD + image handlers
    │   ├── publicProductController.js   # public product listing/search/detail
    │   ├── cartController.js            # cart request handlers
    │   ├── wishlistController.js        # wishlist request handlers
    │   └── profileController.js         # profile/address/order-history handlers
    ├── services/
    │   ├── authService.js         # auth business logic
    │   ├── taxonomyService.js     # shared CRUD factory for Category + HealthTag
    │   ├── productService.js      # product CRUD + stock/featured/image logic
    │   ├── publicProductService.js # public queries: list, search, featured, related, filters
    │   ├── cartService.js         # cart business logic (add, update, remove, totals)
    │   ├── wishlistService.js     # wishlist logic + move-to-cart
    │   ├── profileService.js      # profile, address, order history
    │   └── imageService.js        # Cloudinary upload/delete helpers
    └── scripts/
        └── seedAdmin.js      # create initial developer admin (npm run seed:admin)
```

### API response format

**Success** (via `ApiResponse`):
```json
{ "success": true, "message": "...", "data": <payload|null>, "meta": { } }
```
`meta` is only present when set (e.g. pagination).

**Error** (via `errorHandler`):
```json
{ "success": false, "message": "...", "errors": [ { "field": "...", "message": "..." } ], "stack": "..." }
```
`errors` present only when non-empty. `stack` present only in development.

### Error handling

- Throw `ApiError` (or use its static factories: `ApiError.badRequest`,
  `.unauthorized`, `.forbidden`, `.notFound`, `.conflict`, `.internal`) for
  expected, client-facing failures.
- Wrap async route handlers in `asyncHandler` so rejections reach the global handler.
- The global `errorHandler` translates Mongoose `ValidationError` (400),
  `CastError` (400), and duplicate-key `11000` (409) automatically.
- Anything that isn't an `ApiError` is treated as a 500 (message hidden in prod).

### Config / env

- All env access goes through `config/env.js` — never read `process.env` elsewhere.
- Required vars are validated at boot; the process refuses to start if any is missing.
- Currently required: `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`,
  `JWT_ADMIN_ACCESS_SECRET`, `JWT_ADMIN_REFRESH_SECRET`, `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_USER`, `SMTP_PASS`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`. Defaulted: `NODE_ENV`, `PORT` (5000), `CORS_ORIGINS`,
  `JWT_ACCESS_EXPIRES_IN` (15m), `JWT_REFRESH_EXPIRES_IN_DAYS` (7), `SMTP_FROM`.

### Conventions

- ES Modules everywhere (`import`/`export`), `.js` extensions in relative imports.
- Security: `helmet` + `cors` (origins from env) applied globally.
- Health check: `GET /health`.
- API will be versioned under `/api/v1/...` when routes are added.

## Module status

- **Module 1 — Project setup & schemas:** COMPLETE.
  - [x] Express server, folder structure, DB connection w/ retry, env validation,
        error handling, response format, request logger.
  - [x] All 9 Mongoose schemas: `User`, `Admin`, `Product`, `Category`,
        `HealthTag`, `Cart`, `Wishlist`, `Order`, `Counter` — designed field by
        field with client sign-off, exported via `src/models/index.js`.
    - Every field/index/default/enum was explicitly confirmed. Same rule applies
      to future changes: do not add or alter fields, indexes, defaults, required
      flags, enums, or relationships without explicit confirmation.
  - **Not exercised live:** DB connection + Counter atomic increment + full
    server boot — no MongoDB was available in the build environment. All
    schema-level validation (compile, validate, defaults, enums, hooks) passed.

- **Module 2 — Authentication:** COMPLETE.
  - [x] Customer auth: register, email OTP verification, resend OTP, login,
        refresh, logout, forgot-password, reset-password.
  - [x] Admin auth: login, refresh, logout (no self-registration, no OTP).
  - [x] JWT + refresh token flow with DB-stored hashed refresh tokens.
  - [x] Rate limiting, failed-login lockout, OTP attempt limiting.
  - [x] Auth middleware (customer + admin) and role-check middleware.
  - [x] Email service (nodemailer, minimal templates — Module 11 for full system).
  - [x] Admin seed script (`npm run seed:admin`).
  - [x] Schema updates: auth fields added to User (7 fields) and Admin (2 fields),
        plus new RefreshToken model.
  - **Not exercised live:** No MongoDB available. All code compiles, token
    sign/verify/isolation works, OTP hash/verify works. Full flow needs a running DB.

- **Module 4 — Products (Admin CRUD):** COMPLETE.
  - [x] Full admin CRUD: create, update, archive (soft delete), get by ID,
        list with pagination/search/filter.
  - [x] Toggle featured, update stock (with auto status flip).
  - [x] Image management: upload to Cloudinary (auto-resize + quality), delete,
        reorder, set primary. Max 8 images, 5MB each, jpg/png/webp.
  - [x] Role permissions: developer gets full access; client blocked from
        editing hsnCode, gstRate, sku, status on update. Only developer can archive.
  - [x] Schema change: `publicId` added to Product image subdoc for Cloudinary
        deletion. No other schema changes.
  - [x] New env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
  - **Not exercised live:** No MongoDB/Cloudinary available. All code compiles,
    app loads, schema validates with publicId field.

- **Module 3 — Categories & Health Tags:** COMPLETE.
  - [x] Admin CRUD for both (developer role only): create, update, soft-delete,
        list all (incl. inactive), get by ID.
  - [x] Public endpoints: list active categories, list active health tags.
  - [x] Shared `taxonomyService` factory — one service covers both models.
  - [x] No schema changes (Module 1 schemas already had all needed fields).
  - [x] Soft delete (`isActive: false`) — no hard delete. Slug auto-regenerated
        on rename via pre-validate hook.
  - [x] Client role blocked — only `developer` can manage taxonomies.

- **Module 5 — Public Product Listing & Search:** COMPLETE.
  - [x] Public storefront endpoints (no auth required):
    - `GET /api/v1/products` — list with filters, sorting, pagination
    - `GET /api/v1/products/search` — full-text search (rate-limited 60/min)
    - `GET /api/v1/products/featured` — featured products for homepage
    - `GET /api/v1/products/filters` — filter metadata (categories, tags, price range, forms)
    - `GET /api/v1/products/:slug` — single product by slug (full detail)
    - `GET /api/v1/products/:slug/related` — related products (same category + shared tags, max 6)
  - [x] MongoDB text index on Product: name (weight 10), benefits (5),
        indications (3), ingredients.name (2). Named `product_search`.
  - [x] Public field sanitisation: `inStock` boolean computed from stock,
        raw `stock` stripped. `publicId` stripped from images. Internal fields
        (sku, hsnCode, gstRate, lowStockThreshold, status) never selected.
  - [x] List items trimmed to primary image only; detail returns all images.
  - [x] Search rate limiter: 60 requests/min per IP on `/search`.
  - [x] No caching layer (defer to later).
  - **Not exercised live:** No MongoDB available. All code compiles, app loads,
    routes mount correctly.

- **Module 6 — Cart & Wishlist:** COMPLETE.
  - [x] Cart: add item, update quantity, remove item, clear cart, get cart
        with fully calculated totals (line totals, subtotal, shipping, grand total).
  - [x] Wishlist: add, remove, get, move-to-cart.
  - [x] Stock validation on add and quantity update. Stale items flagged on
        cart retrieval (unavailable, out_of_stock, insufficient_stock).
  - [x] Shipping: free at ₹1000+ subtotal, flat ₹160 below.
  - [x] Cart limits: max 10 per item, max 20 distinct items.
  - [x] Wishlist limit: max 50 items.
  - [x] Duplicate add to cart increments quantity (capped at 10).
  - [x] Duplicate add to wishlist silently succeeds (idempotent).
  - [x] No schema changes (Module 1 Cart and Wishlist models used as-is).
  - [x] GST pricing decision locked: `Product.price` is GST-inclusive.
  - **Not exercised live:** No MongoDB available. All code compiles, app loads,
    routes mount correctly.

- **Module 7 — User Profile & Address:** COMPLETE.
  - [x] Get/update profile (name, phone). Email not changeable.
  - [x] Change password (requires current password, 8-char min).
  - [x] Get/update delivery address (single address, full replace).
  - [x] Order history: list (paginated) + get detail (own orders only).
  - [x] Schema change: User `addresses` array → single `address` subdoc.
        Dropped `label`, `isDefault`. Added `INDIAN_STATES` enum for `state`.
  - [x] No account deletion/deactivation (skip for now).
  - [x] No email change.
  - **Not exercised live:** No MongoDB available. All code compiles, app loads,
    routes mount correctly.

## Confirmed product decisions (Module 4)

### Image storage
- **Provider:** Cloudinary. SDK `cloudinary` v2, configured in `config/cloudinary.js`.
- **Upload:** multer memory storage → buffer → Cloudinary upload stream.
  Folder: `neelkanth/products/`.
- **Transforms on upload:** `{ width: 800, height: 800, crop: 'limit' }` +
  `{ quality: 'auto', fetch_format: 'auto' }`. Images are auto-optimised and
  served as webp where supported.
- **Constraints:** max 8 images per product, 5MB per file, jpg/png/webp only.
- **Primary:** first uploaded image auto-set as primary. Explicit `setPrimary`
  endpoint changes it. If primary is deleted, first remaining auto-promoted.
- **Deletion:** Cloudinary `destroy(publicId)` called on image removal. Logged
  but non-blocking (image cleanup failure doesn't break the request).
- **`publicId`** added to Product image subdoc (Module 4 schema change).

### Delete behaviour
- **Soft delete only:** DELETE endpoint sets `status: 'archived'`. Product
  stays in DB. Cart/wishlist/order refs stay valid. Cloudinary images retained
  (product may be reactivated). Only `developer` role can archive.

### Stock auto-flip
- `updateStock` sets stock and auto-flips status:
  - stock → 0 while `active` → status becomes `out_of_stock`
  - stock → >0 while `out_of_stock` → status becomes `active`
- Both roles can update stock.

## Confirmed public product decisions (Module 5)

### Public field whitelist
- **List items:** name, slug, shortDescription, images (primary only), price,
  packSize, form, isFeatured, category (name+slug), healthTags (name+slug),
  inStock (computed boolean), createdAt.
- **Detail page:** all list fields + description, ingredients, dosage,
  directions, benefits, indications, precautions, all images (not just primary).
- **Never exposed publicly:** sku, hsnCode, gstRate, lowStockThreshold, status,
  stock (raw number), image publicId.

### Search approach
- **Full-text** (query ≥ 3 chars): MongoDB `$text` index with relevance scoring
  (`$meta: 'textScore'`). Weighted: name 10, benefits 5, indications 3,
  ingredients.name 2.
- **Short query** (< 3 chars): regex fallback on `name` field, sorted alpha.
- Text score stripped from response.

### Visibility rules
- Only products with `status` in `['active', 'out_of_stock']` are shown.
- Out-of-stock products visible but flagged (`inStock: false`).
- Featured endpoint only returns `status: 'active'` (not out-of-stock).

### Sorting & pagination
- Default sort: `newest` (createdAt desc).
- Available sorts: `price_asc`, `price_desc`, `newest`, `name_asc`.
- Default page size: 20, max: 50.

### Filters
- `category` (ObjectId), `healthTags` (comma-separated ObjectIds, match any),
  `priceMin`/`priceMax` (number range), `inStock` (`'true'`), `form` (enum).
- `/filters` endpoint returns active categories, health tags, price range
  (min/max via aggregation), and distinct forms in use.

### Related products
- Strategy: same category first (up to 6), then fill with shared health tags.
  Always excludes the current product. Max 6 items.
- Only `status: 'active'` (not out-of-stock) in related results.

## Confirmed profile & address decisions (Module 7)

### Address
- **Single address per user** — not multiple saved addresses. The `addresses`
  array was replaced with a single `address` embedded subdoc.
- **Fields:** name (required), phone (10-digit, optional — falls back to profile
  phone), line1 (required), line2 (optional), city (required), state (required,
  enum of Indian states/UTs), pincode (required, 6-digit regex).
- **State is a structured enum** (`INDIAN_STATES`, 36 entries: 28 states + 8 UTs).
  This ensures the invoice module can reliably compare buyer vs seller state.
- **Pincode:** format check only (6-digit regex), no real pincode list validation.
- **Address phone** is separate from profile phone. Delivery contact can differ
  from the account contact.

### Profile
- **Phone is optional** on the profile. Not required at registration.
- **Email cannot be changed** — set at registration, immutable.
- **No account deletion/deactivation** — admin can set `isActive: false` if needed.
- **Change password** requires current password + 8-char minimum for new password.

### Order history
- **List view:** orderNumber, status, paymentMethod, paymentStatus, grandTotal,
  itemCount (computed), createdAt. Paginated: default 10, max 20.
- **Detail view:** full order with all fields. Raw PhonePe gateway payload
  stripped from customer view.
- **Own orders only** — customer can only see orders where `user` matches.
- **Order address snapshot** is immutable — editing the profile address does not
  affect existing orders (confirmed: Order schema stores its own snapshot).

### Endpoints

**Profile** — `/api/v1/profile/` (all require customer auth):
| Method | Path | Purpose |
|--------|------|---------|
| GET | / | Get profile |
| PATCH | / | Update profile (name, phone) |
| POST | /change-password | Change password |
| GET | /address | Get delivery address |
| PUT | /address | Set/update delivery address |
| GET | /orders | List own orders (paginated) |
| GET | /orders/:orderNumber | Get order detail |

### Schema changes (Module 7)

**User** — address restructured:
- Removed: `addresses` (array of subdocs with label, isDefault, _id).
- Added: `address` (single subdoc, no _id). `state` field changed from
  free-text String to `enum: INDIAN_STATES`.
- New export: `INDIAN_STATES` (array of 36 state/UT names).

## Confirmed cart & wishlist decisions (Module 6)

### Pricing & GST
- **Product.price is GST-inclusive** (what the customer pays). Tax is backed
  out at invoice time (Module 10). Example: ₹100 item at 12% GST → taxable
  ₹89.29 + tax ₹10.71.
- Cart subtotal, shipping threshold, and grand total all use GST-inclusive prices.

### Shipping calculation
- **Free shipping** when subtotal (sum of line totals) ≥ ₹1000.
- **Flat ₹160** when subtotal < ₹1000.
- Threshold based on GST-inclusive subtotal (the number the customer sees).

### Cart behaviour
- **Logged-in only.** No guest carts (confirmed Module 1).
- **Live price only.** No price snapshot at add-time (confirmed Module 1).
- **Max 10 units** per line item, **max 20 distinct items** per cart.
- **Duplicate add increments** quantity (capped at 10, stock-validated).
- **Stock validated** on add and quantity update. If stock is insufficient,
  the request is rejected with a clear message.
- **Stale item flagging** on cart retrieval: items whose product has gone
  inactive/archived are flagged `unavailable`, out-of-stock products flagged
  `out_of_stock`, and items where requested quantity exceeds available stock
  flagged `insufficient_stock`. Items are **not auto-removed** — the customer
  must handle them before checkout.
- **No cart expiry.** `abandonedEmailSentAt` on Cart supports Module 11
  abandoned-cart emails. Reset when cart is modified.

### Wishlist behaviour
- **Max 50 items.**
- **Idempotent add:** adding an already-present item silently succeeds.
- **Move-to-cart:** removes from wishlist + adds to cart (quantity 1) in one
  operation. Cart add validates stock/availability; if it fails, the item
  stays in the wishlist.

### Endpoints

**Cart** — `/api/v1/cart/` (all require customer auth):
| Method | Path | Purpose |
|--------|------|---------|
| GET | / | Get cart with calculated totals |
| POST | /items | Add item (body: productId, quantity?) |
| PATCH | /items/:productId | Update quantity (body: quantity) |
| DELETE | /items/:productId | Remove item |
| DELETE | / | Clear cart |

**Wishlist** — `/api/v1/wishlist/` (all require customer auth):
| Method | Path | Purpose |
|--------|------|---------|
| GET | / | Get wishlist |
| POST | /items | Add item (body: productId) |
| DELETE | /items/:productId | Remove item |
| POST | /items/:productId/move-to-cart | Move to cart (quantity 1) |

### Role permission matrix

| Action | developer | client |
|--------|-----------|--------|
| Create product | Yes | Yes |
| Update product | All fields | All EXCEPT hsnCode, gstRate, sku, status |
| Archive (soft delete) | Yes | **No** |
| Toggle featured | Yes | Yes |
| Update stock | Yes | Yes |
| Upload/delete/reorder images | Yes | Yes |
| List / get products | Yes | Yes |

### Endpoints

**Admin products** — `/api/v1/admin/products/`:
| Method | Path | Roles | Purpose |
|--------|------|-------|---------|
| POST | / | dev, client | Create product |
| GET | / | dev, client | List all (paginated, search, filter) |
| GET | /:id | dev, client | Get product by ID (full detail) |
| PUT | /:id | dev, client | Update product (client: blocked fields stripped) |
| DELETE | /:id | developer | Soft delete (archive) |
| PATCH | /:id/featured | dev, client | Toggle featured flag |
| PATCH | /:id/stock | dev, client | Update stock (auto status flip) |
| POST | /:id/images | dev, client | Upload images (multipart, max 8) |
| DELETE | /:id/images/:publicId | dev, client | Remove image + Cloudinary cleanup |
| PUT | /:id/images/reorder | dev, client | Reorder images by publicId array |
| PATCH | /:id/images/primary | dev, client | Set primary image |

### Pagination (admin product list)
Query params: `page` (default 1), `limit` (default 20, max 50), `search`
(regex on name/sku), `category` (ObjectId), `status` (enum), `featured`
(true/false). Response includes `meta: { page, limit, total, pages }`.

### Schema change (Module 4)
**Product image subdoc** — 1 field added:
- `publicId` (String, trim) — Cloudinary public_id for deletion.

### Fields not added (confirmed skip)
- `expiryDate` — skipped (Ayurvedic products have long shelf lives; manual tracking).
- `mrp` — declined in Module 1 (no discount display).

## Confirmed taxonomy decisions (Module 3)

### Behaviour
- **Delete:** soft delete only (`isActive: false`). No hard delete endpoint.
  Product refs stay valid. Admin can reactivate by updating `isActive: true`.
- **Slug:** auto-generated from `name` on create and on rename (pre-validate hook).
  Manually setting a slug is not supported — always derived.
- **Uniqueness:** `name` unique (Mongoose unique index, case-sensitive). `slug`
  unique + lowercased. Duplicate names caught by the global error handler → 409.
- **Ordering:** `displayOrder` (Number, default 0) + secondary sort by `name`.
- **Flat list:** no nesting / sub-categories (confirmed Module 1).

### Endpoints

**Categories** — `/api/v1/categories/`:
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /active | Public | List active categories (storefront nav) |
| GET | / | developer | List all (incl. inactive) |
| GET | /:id | developer | Get one by ID |
| POST | / | developer | Create category |
| PUT | /:id | developer | Update category |
| DELETE | /:id | developer | Soft-delete (deactivate) |

**Health Tags** — `/api/v1/health-tags/`:
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /active | Public | List active health tags (storefront) |
| GET | / | developer | List all (incl. inactive) |
| GET | /:id | developer | Get one by ID |
| POST | / | developer | Create health tag |
| PUT | /:id | developer | Update health tag |
| DELETE | /:id | developer | Soft-delete (deactivate) |

### Architecture note
Both taxonomies use a shared `taxonomyService.js` factory. The factory accepts a
Mongoose model + label and returns identical CRUD methods. Controllers are thin
wrappers calling the service and sending `ApiResponse`. This avoids duplicating
logic for two structurally identical models.

## Confirmed auth decisions (Module 2)

### Token strategy
- **Access token:** JWT, 15-minute expiry, separate secrets for customer vs admin.
- **Refresh token:** random hex (80 chars), SHA-256 hashed in DB, 7-day expiry.
  TTL index on `expiresAt` for automatic cleanup by MongoDB.
- **Logout:** delete refresh token from DB. Access token lives out its natural
  15-minute expiry (no blacklist — too short to warrant one).
- **Refresh = rotation:** old token is deleted, new pair is issued on each refresh.
- **Separate secrets:** `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` (customer) vs
  `JWT_ADMIN_ACCESS_SECRET` / `JWT_ADMIN_REFRESH_SECRET` (admin). A leaked
  customer token cannot access admin endpoints, and vice versa. Enforced via JWT
  `audience` claim ('user' vs 'admin').

### OTP
- **Length:** 6 digits. **Expiry:** 10 minutes. **Max attempts:** 5 (then must resend).
- **Resend cooldown:** 60 seconds (derived from `emailOtpExpiresAt` arithmetic).
- **Hashing:** bcrypt (12 rounds) — a 6-digit code has only 1M possibilities, so
  SHA-256 would be trivially reversible. bcrypt is slow enough to resist offline
  brute-force.
- **Storage:** OTP hash + expiry + attempt count stored directly on the User document
  (not a separate collection). Cleared after successful verification.

### Password
- **Rules:** 8-character minimum, no complexity requirements (uppercase/symbol).
- **Hashing:** bcrypt, 12 salt rounds (~250ms per hash).
- **Reset flow:** random 32-byte hex token → SHA-256 hashed on User → raw token
  emailed as a link → 1-hour expiry. On successful reset, all refresh tokens for
  that user are revoked (force re-login everywhere).

### Security
- **Rate limiting:** `express-rate-limit`, 10 requests per 15-minute window per IP,
  applied only to auth endpoints (login, OTP, forgot-password). Not global.
- **Failed-login lockout:** account locked for 15 minutes after 5 consecutive
  wrong passwords. Counter resets on successful login. Applies to both User and Admin.
- **Unverified accounts:** left in DB indefinitely (can't log in). No auto-cleanup.

### Endpoints

**Customer auth** — `/api/v1/auth/`:
| Method | Path | Auth | Rate-limited | Purpose |
|--------|------|------|-------------|---------|
| POST | /register | No | Yes | Signup + send OTP |
| POST | /verify-email | No | Yes | Verify email OTP |
| POST | /resend-otp | No | Yes | Resend verification OTP |
| POST | /login | No | Yes | Email + password login |
| POST | /refresh | No | No | Rotate refresh token |
| POST | /logout | Yes | No | Revoke refresh token |
| POST | /forgot-password | No | Yes | Send reset link |
| POST | /reset-password | No | Yes | Reset password via token |

**Admin auth** — `/api/v1/admin/auth/`:
| Method | Path | Auth | Rate-limited | Purpose |
|--------|------|------|-------------|---------|
| POST | /login | No | Yes | Admin email + password |
| POST | /refresh | No | No | Rotate refresh token |
| POST | /logout | Yes (admin) | No | Revoke refresh token |

### Schema changes (Module 2)

**User** — 7 fields added:
- `emailOtp` (String, select:false), `emailOtpExpiresAt` (Date), `emailOtpAttempts` (Number, default 0)
- `passwordResetToken` (String, select:false), `passwordResetExpiresAt` (Date)
- `failedLoginAttempts` (Number, default 0), `accountLockedUntil` (Date)

**Admin** — 2 fields added:
- `failedLoginAttempts` (Number, default 0), `accountLockedUntil` (Date)

**RefreshToken** (new model):
- `tokenHash` (String, required, indexed), `user` (ObjectId, refPath→userModel),
  `userModel` (enum User/Admin), `expiresAt` (Date, TTL index). `{ timestamps: true }`.

## Confirmed schema decisions

### User (`server/src/models/User.js`) — signed off

Customer/shopper account. **No `role` field** (admins live in `Admin`).

- `name` — String, required. Single field (not split first/last).
- `email` — String, required, **unique**, lowercase, trimmed, indexed. Login id + OTP target.
- `passwordHash` — String, required, **`select: false`** (bcrypt hash; never returned by default).
- `isEmailVerified` — Boolean, default `false` (gates email-OTP flow).
- `phone` — String, optional, account-level. Validated as 10 digits.
- `address` — single embedded subdoc (no `_id`, Module 7 change):
  - `name` (req), `phone` (opt, 10-digit, falls back to account phone),
    `line1` (req), `line2` (opt), `city` (req),
    `state` (req, **enum `INDIAN_STATES`** — 28 states + 8 UTs),
    `pincode` (req, 6-digit).
- `isActive` — Boolean, default `true` (block/disable without deleting).
- `lastLoginAt` — Date.
- `{ timestamps: true }` → `createdAt` / `updatedAt`.

Added format validators: phone `^\d{10}$`, pincode `^\d{6}$`.

### Admin (`server/src/models/Admin.js`) — signed off

Back-office/staff account, separate from `User`. Created by a developer (no self-signup).

- `name` — String, required.
- `email` — String, required, **unique**, lowercase, trimmed, indexed.
- `passwordHash` — String, required, **`select: false`**.
- `role` — String, required, **enum `['developer','client']`, no default** (must be
  set explicitly). Exported as `ADMIN_ROLES` from the model.
- `isEmailVerified` — Boolean, default `false` (kept for parity; set at provisioning).
- `phone` — String, optional, 10-digit validated.
- `isActive` — Boolean, default `true`.
- `lastLoginAt` — Date.
- `{ timestamps: true }`.

No `createdBy` audit field (declined). No login OTP 2FA (may be added later).

### Product (`server/src/models/Product.js`) — signed off

Single sellable item. **No variants** — each pack size is its own Product.

- **Identity:** `name` (req), `slug` (unique, indexed, auto-generated from name via
  pre-validate hook), `sku` (req, **unique** — CSV import key), `shortDescription`,
  `description`, `images` ([{ url req, alt, isPrimary }]).
- **Ayurvedic detail:** `ingredients` ([{ name req, quantity }] — structured),
  `dosage`, `directions`, `benefits` ([String]), `indications` ([String]),
  `precautions` (safety/side-effects). (Declined: `brand`.)
- **Classification:** `category` (single ref Category, req, indexed),
  `healthTags` ([ref HealthTag], indexed), `packSize` (e.g. "60 tablets"),
  `form` (enum `[tablet,syrup,powder,oil,churna,capsule,other]`).
- **Commerce:** `price` (req, ₹, min 0), `stock` (default 0, indexed),
  `lowStockThreshold` (default 5), `hsnCode` (**req** — GST), `gstRate` (**req**,
  %, 0–28 — CGST/SGST vs IGST split), `isFeatured` (default false, indexed),
  `status` (enum `[draft,active,out_of_stock,archived]`, default `draft`, indexed).
  (Declined: `mrp`.)
- `{ timestamps: true }`.
- **Indexes:** unique `slug`, unique `sku`; plain `category`, `healthTags`,
  `stock`, `isFeatured`, `status`, `price`. Full-text search index deferred to
  the search module.
- Exports `PRODUCT_FORMS`, `PRODUCT_STATUSES`.
- **Behavioural note (later modules):** stock decremented at order placement;
  `status` flips to `out_of_stock` when stock reaches 0 — enforce in order logic.

### Category (`server/src/models/Category.js`) — signed off

Standard product classification. **Flat list — no nesting** (`parent` declined).

- `name` (req, **unique**), `slug` (unique, indexed, auto-gen), `description`,
  `image` (tile URL), `displayOrder` (Number, default 0 — manual nav sort),
  `isActive` (default true). `{ timestamps: true }`.

### HealthTag (`server/src/models/HealthTag.js`) — signed off

Health-concern browsing facet (e.g. "Diabetes", "Joint Pain"). Same shape as Category.

- `name` (req, **unique**), `slug` (unique, indexed, auto-gen), `description`,
  `image`, `displayOrder` (default 0), `isActive` (default true). `{ timestamps: true }`.

_Shared:_ slug generation extracted to `server/src/utils/slugify.js`, used by
Product, Category, HealthTag. No SEO meta fields on taxonomies (declined).

### Cart (`server/src/models/Cart.js`) — signed off

One active cart per **logged-in user** (no guest carts).

- `user` (ref User, req, **unique**, indexed).
- `items` — `[{ product (ref Product, req), quantity (req, min 1, default 1) }]`,
  subdoc `_id: false` (product is the line key). **Live price only** — no price
  snapshot; totals computed from Product at read/checkout.
- `abandonedEmailSentAt` (Date) — prevents re-emailing the same abandoned cart.
- `{ timestamps: true }` — `updatedAt` drives abandoned-cart detection.
- **Behavioural note:** cart does NOT touch stock; inventory decremented at order
  placement. (Declined: guest `sessionId`, `priceAtAdd`, `reminderCount`.)

### Wishlist (`server/src/models/Wishlist.js`) — signed off

One save-for-later list per user (no named/multiple lists).

- `user` (ref User, req, **unique**, indexed).
- `items` — `[{ product (ref Product, req), addedAt (Date, default now) }]`,
  subdoc `_id: false`.
- `{ timestamps: true }`.
- Duplicate prevention handled in app logic (`$addToSet`), not schema.

### Order (`server/src/models/Order.js`) — signed off

Immutable financial record. Everything needed to render the GST invoice is
**snapshotted at placement**. Seller GSTIN / pickup address / seller state come
from **app config** at render time (NOT stored on the order); only `taxType`
(intra/inter) is stored.

- **Identity:** `orderNumber` (customer-facing, unique) + `invoiceNumber` (GST
  serial, unique) — **both assigned at placement via Counter**; `invoiceDate`;
  `user` (ref).
- **items[]** (snapshot, `_id:false`, must be non-empty): `product` (ref) +
  `name, sku, hsnCode, packSize, quantity, unitPrice, gstRate, taxableAmount,
  taxAmount, lineTotal`.
- **Money:** `subtotal` (Σ taxableAmount), `shippingFee` (0 or 160),
  `taxType` (enum `intra_state`/`inter_state`), `cgstTotal`, `sgstTotal`,
  `igstTotal`, `taxTotal`, `grandTotal`.
- **Shipping:** `shippingAddress` snapshot (name, phone, line1/2, city, state,
  pincode — also used as invoice billing address; no separate billing address).
  `courier`, `trackingNumber`.
- **Payment:** `paymentMethod` (enum `cod`/`phonepe`), `paymentStatus`
  (enum `pending`/`paid`/`failed`), `phonepe` gateway subdoc
  (merchantTransactionId, transactionId, providerReferenceId, amount, state,
  paidAt, raw), `isCodConfirmed` + `codConfirmedAt` (COD email-OTP).
- **Fulfilment:** `status` (enum `pending,confirmed,processing,shipped,delivered,
  cancelled`, default `pending`), `statusHistory[]` ({ status, at, note,
  by→Admin }). Cancellation = status `cancelled` + history entry (no separate
  cancelReason/cancelledBy field — declined).
- `{ timestamps: true }` (`createdAt` = placed time). Exports `ORDER_STATUSES`,
  `PAYMENT_METHODS`, `PAYMENT_STATUSES`, `TAX_TYPES`.

**RESOLVED (Module 6):** Product prices are **GST-inclusive**. At invoice time,
tax is backed out: `taxableAmount = unitPrice / (1 + gstRate/100)`,
`taxAmount = unitPrice - taxableAmount`.
**Behavioural rules (order module):** stock decremented at placement; cancel
allowed only before `shipped`; `status`→`out_of_stock` on Product when stock 0.

### Counter (`server/src/models/Counter.js`) — signed off

Atomic sequence generator for order & invoice numbering.

- Keyed by `_id` (String sequence name); `seq` (Number, default 0). `versionKey: false`.
- Static `Counter.getNextSequence(key)` → atomic `findByIdAndUpdate` with
  `$inc`, `upsert`, `setDefaultsOnInsert`; safe under concurrent placement.
- **Dumb counter:** stores only the raw integer. Prefixes / zero-padding /
  format built in app code (declined format metadata on the doc).
- **Invoice numbering resets per Indian financial year:** caller uses keys like
  `invoice-2026-27` (built in app/config). `order` is one continuous sequence.
