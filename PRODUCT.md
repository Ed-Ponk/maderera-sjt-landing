# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audiences (confirmed: multiple B2B profiles plus general public), all regional buyers in northern Peru (Piura / Lambayeque) evaluating a lumber supplier before purchasing:

- Constructoras y maestros de obra: compran madera estructural por volumen para proyectos de construcción.
- Arquitectos y diseñadores: necesitan especificaciones técnicas, especies y acabados para sus proyectos.
- Carpinteros y ebanistas: compran tablones y tableros para mueblería y carpintería fina.
- Público general con proyectos de mejora del hogar o compra minorista.

The site is the first point of contact and the mechanism to request a quote before or instead of visiting a sede.

## Product Purpose

Corporate website for Maderera San Judas Tadeo that presents the product catalog (maderas en tablones, triplays y tableros procesados, acabados y complementos) with technical specifications, shows per-sede stock availability, and converts visitors into quote requests — equally through a WhatsApp quote cart and a contact/query form.

## Positioning

A regional lumber supplier in northern Peru that combines:

- Technical transparency: published specs (especie, densidad, humedad, medidas estructuradas en mm) so buyers can compare and specify before visiting.
- Multi-sede presence: inventory availability per sede (Talara, Paita; Chiclayo próximamente).
- Value-added services: corte a medida, dimensionado, asesoría técnica, entregas a domicilio.

The differentiator a generic timber seller could not copy verbatim is the spec-first, per-sede catalog with an integrated WhatsApp quotation flow.

## Operating Context

Buyers are on construction sites, workshops, or offices comparing timber options; quotes happen through WhatsApp, mostly on mobile. The site must therefore read well on mobile (quote flow, sede selector, cart) and on desktop (catalog browsing and technical comparison). Contact workflows rely on the WhatsApp quote message and the contact form. Content is entirely in Spanish (es_PE).

## Capabilities and Constraints

Confirmed functionality:

- Catalog of products with category filtering; structured technical measures (espesor / ancho / largo en mm) enabling exact numeric filtering; spec display per product (densidad, humedad, medidasDisplay).
- Per-sede inventory with availability states (DISPONIBLE / A_PEDIDO). Chiclayo is marked "próximamente" and still accepts quote leads.
- Sede selector persisted globally; quotation cart (Zustand, persisted) that builds and sends a WhatsApp message via wa.me.
- Pages: home, nosotros y servicios, catálogo (per category), producto (detail), sedes (per sede).
- Product types: MADERA_TABLON, TABLERO_PROCESADO, ACABADO.

Constraints:

- Platform is responsive web.
- Content in Spanish, locale es_PE.
- Data served from a database via Prisma: SQLite for dev (prisma/dev.db), PostgreSQL in production (docker-compose).

Explicitly undecided / pending from client:

- Comparative marketing claims in current copy ("Líderes...", "Precios de Fábrica") must be fact-checked by the client before being treated as confirmed commitments.
- The contact form currently has no submission handler (non-functional).
- Per-sede phone numbers in the seed are placeholders; only WhatsApp and email were confirmed.
- Chiclayo has no real address yet; it remains an announced "próximamente" sede.

## Brand Commitments

Confirmed real assets (provided by the client):

- Company name: Maderera San Judas Tadeo.
- Logo: public/images/logo_maderera_san_judas_tadeo.png.
- WhatsApp: +51 933 332 094 (placeholder in code/env must be updated to this number).
- Email: ventas@madererasanjudastadeo.com (replaces placeholder proyectos@sanjudastadeo.pe).
- Sedes:
  - Paita — Urbanización Sol y Mar, Mz. C Lt. 6, Paita, Piura.
  - Talara — Mza. C Lote 10, Urb. Los Robles, Talara.
  - Chiclayo — próxima apertura.
- Voice: professional, structural-and-artisan Spanish ("Soluciones robustas y artesanales", "Forjando calidad, construyendo confianza").

## Evidence on Hand

- Logo asset at public/images/logo_maderera_san_judas_tadeo.png.
- Real sede names, addresses, WhatsApp and email provided by the client (see Brand Commitments).
- All product and hero imagery is Unsplash stock photography, not real material or facilities; it must not be presented as actual product photos.
- No testimonials, case studies, price lists, or certification evidence exist; future work must not fabricate them.

## Product Principles

1. Technical honesty: publish real specs and availability states; never fabricate inventory, testimonials, or prices.
2. Mobile-first quote path: the WhatsApp quotation flow is the primary lead mechanism and must stay frictionless on phones.
3. Regional proximity: every surface reinforces the multi-sede presence in northern Peru.
4. Equally weighted conversion: WhatsApp quotes and the contact form must receive equal attention and clarity.
5. Content truth: placeholders and stock assets are flagged, not silently shipped as final.

## Accessibility & Inclusion

No product-specific accessibility requirement was established. The existing UI uses standard semantic markup; keep contrast and focus states sound across the light Material-style palette.
