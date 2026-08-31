---
name: Maderera San Judas Tadeo
description: La web como aserradero — especificaciones dimensionadas, stock por sede y cotización como ticket de corte.
colors:
  charcoal-ink: "#26261f"
  sawdust-cream: "#f4ead6"
  safety-orange: "#e05e16"
  signage-orange: "#ff9a4d"
  burnt-signage: "#9a3500"
  wood-bark: "#7a5230"
  on-ink-amber: "#e0cfaa"
  on-dark-bark: "#453928"
  on-orange-ink: "#2a1603"
  parchment: "#fbf3e0"
  sand: "#efe1c3"
  tan: "#e6d6b6"
  khaki: "#e2cf9c"
  dust: "#dccaa4"
  olive-text: "#5f5342"
  outline-sand: "#8d7a5a"
  outline-pale: "#c8b794"
typography:
  display:
    fontFamily: "Big Shoulders, sans-serif"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0.01em"
  stencil:
    fontFamily: "Big Shoulders Stencil, sans-serif"
    fontWeight: 600
    textTransform: "uppercase"
    letterSpacing: "0.08em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    textTransform: "uppercase"
    letterSpacing: "0.08em"
rounded:
  sm: "0.125rem"
  lg: "0.25rem"
  xl: "0.5rem"
spacing:
  xs: "4px"
  base: "8px"
  sm: "12px"
  md: "24px"
  lg: "48px"
  xl: "80px"
components:
  cta-primary:
    backgroundColor: "{colors.safety-orange}"
    textColor: "{colors.on-orange-ink}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
  cta-outline:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  cta-dashed:
    backgroundColor: "transparent"
    textColor: "{colors.wood-bark}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
  stock-stamp:
    backgroundColor: "{colors.safety-orange}"
    textColor: "{colors.on-orange-ink}"
    rounded: "0"
    padding: "4px 10px"
---

# Design System: Maderera San Judas Tadeo

## Overview

**Creative North Star: "El Aserradero"**

La web es un aserradero en pleno corte, visto en la luz cálida de un patio soleado del norte peruano: no industrial-frío, sino taller de confianza. El catálogo se presenta como el despiece de la troza — cada producto dimensionado con sus medidas reales en milímetros — y la cotización se resuelve como un ticket de corte que se envía por WhatsApp. El acero carbón es la tinta; el naranja de seguridad, el acento comprometido; el aserrín, el papel. Nada está "decorado": cada sello, placa y cota cumple una función del mundo (estado de stock, identificación, medida).

El mundo se lee luminoso: superficies crema aserrín, titulares condensados y estarcidos, sellos rectangulares rotados un grado, una cinta de medición SVG como firma. Los bordes son duros y los ángulos casi rectos, pero la sombra es suave y ambiental — el patrón es de placa estampada, no de neobrutalismo.

**Key Characteristics:**
- Especificación primero: toda medida se escribe en mono, como cota de taller.
- Acciones y sellos legibles: placa naranja = acción/CTA; sello = estado de stock, en Archivo bold; estarcido reservado al bloque DESPIECE de la cinta.
- Acero carbón como superficie de estados primarios (footer, sección de calidad).
- Cinta de medición (MeasureTape) como firma recurrente: hero, ficha técnica, nosotros.
- Esquinas casi rectas (radius 0.125rem), bordes de 2px, sello rotado 1°.
- Contrastes verificados: texto normal ≥ 4.5:1, grandes ≥ 3:1.

## Colors

Paleta de patio aserradero: aserrín crema como papel, acero carbón como tinta, naranja de seguridad como acento, madera como soporte.

### Primary
- **Charcoal Ink** (#26261f): tinta principal y superficie de estados "oscuros" (footer, sección de control de calidad). Texto sobre crema a 12.7:1.
- **Sawdust Cream** (#f4ead6): fondo global y "on-primary". Es la luz del patio.
- **On-Ice Amber** (#e0cfaa): texto secundario sobre carbón (descripciones en secciones oscuras, 9.9:1).
- **Dark Bark** (#453928): bordes divisorios dentro de secciones oscuras.

### Secondary
- **Safety Orange** (#e05e16): el acento comprometido. Rellena CTA "Cotizar ahora", sellos de stock DISPONIBLE/Operativa y placas de acción. Siempre con **On-Orange Ink** (#2a1603, 4.8:1).
- **Signage Orange** (#ff9a4d): variante luminosa para texto/iconos sobre superficies carbón (headers estarcidos del footer, 7.2:1).
- **Burnt Signage** (#9a3500): variante profunda para texto/iconos naranja sobre crema (5.6:1).
- **Secondary Container** (#ffc08a): reservada para contenedores del acento; hoy sin uso activo.

### Tertiary
- **Wood Bark** (#7a5230): madera en estado "a pedido"/próximamente (bordes, textos suaves, CTA dashed). Con **On-Tertiary** (#fff6e9) sobre él a 5.8:1.
- **Tertiary Container** (#e2cf9c): khaki de soporte.

### Neutral
- **Parchment** (#fbf3e0): superficie de tarjetas y header (surface-container-lowest).
- **Sand** (#efe1c3) / **Tan** (#e6d6b6) / **Dust** (#dccaa4): superficies contenedor, escala 0–highest.
- **Khaki** (#e2cf9c): surface-variant.
- **Olive Text** (#5f5342): texto secundario sobre crema (on-surface-variant, 5.5:1).
- **Outline Sand** (#8d7a5a) / **Outline Pale** (#c8b794): bordes y separadores.

### Named Rules
**The One Voice Rule.** El naranja de seguridad habla UNA voz: rellena acciones y sellos; nunca es texto suelto sobre crema. Donde el naranja debe ser texto, se usa Signage Orange (sobre oscuro) o Burnt Signage (sobre crema).
**The On-Dark Rule.** Sobre carbón, todo el texto pasa a las variantes luminosas (on-primary, on-primary-container, accent). Ningún #e05e16 crudo como texto sobre carbón (4.2:1, insuficiente).

## Typography

**Display Font:** Big Shoulders (condensado industrial grotesco) con fallback sans-serif.
**Stencil Font:** Big Shoulders Stencil (versión estarcida del mismo esqueleto). Reservada al bloque DESPIECE de la cinta de medición y placas grandes, donde el tamaño compensa las muescas.
**Body Font:** Archivo (sans humanista neutra).
**Mono Font:** JetBrains Mono (para medidas, cotas y etiquetas técnicas).

**Character:** La dupla Big Shoulders + su versión estarcida le da al mundo una letra de taller: pesada, condensada, de gráfica aplicada. Archivo sostiene la lectura con neutralidad — y con bold de 14px escribe los sellos de estado con legibilidad para un público amplio; JetBrains Mono escribe las especificaciones como en una ficha de control.

### Hierarchy
- **Display** (700, clamp a 7xl máx, line-height 0.95, tracking 0.01em): titulares de hero y secciones. Solo en mayúsculas.
- **Headline** (700, 3xl–4xl, uppercase): títulos de tarjeta y subsecciones.
- **Title** (600, text-lg–xl, uppercase): navegación, CTAs, títulos de listas.
- **Body** (400, text-sm–lg, line-height 1.6): lectura; columna de 40–75ch.
- **Label/Mono** (JetBrains Mono, text-xs, uppercase, tracking 0.08em): etiquetas técnicas ("Stock verificado por sede", cotas, "Control A/B/C").

### Named Rules
**The Measurement Rule.** Toda medida, cota o etiqueta técnica es JetBrains Mono en mayúsculas. El mono no es disfraz "técnico": solo se usa donde hay un dato real que medir o nombrar.
**The Legible Stamp Rule.** Todo sello de estado (DISPONIBLE, A PEDIDO, PRÓXIMAMENTE, Operativa) se escribe en Archivo bold de al menos 14px, uppercase, con tracking normal. El estarcido vive solo donde el tamaño lo hace legible: el bloque DESPIECE de la cinta.

## Layout

Contenedor central máximo de 1280px (`max-w-container-max`) con gutter de 24px. Sistema de grilla de 12 columnas a partir de lg; en mobile, todo apila en una columna. Ritmo vertical por secciones: padding 80px en desktop (py-20/28) con separación de 48px entre bloque y bloque.

El hero es un split 6/6: copia a la izquierda (columna de ~576px), imagen a la derecha con sello y cinta de medición al pie. El header es sticky (z-40) sobre Parchment con borde inferior de 2px. El carrito de cotización se presenta como drawer "Ticket de Corte".

## Elevation & Depth

Sistema de sombras suaves y ambientales — nada de sombras duras de offset. La profundidad evoca una placa estampada descansando sobre el papel, no un recorte neobrutalista.

### Shadow Vocabulary
- **plate** (`0 1px 2px rgba(38,38,31,.18), 0 8px 24px rgba(38,38,31,.12)`): CTA primario, sellos, tarjetas de categoría, panel de filtros.
- **plate-lg** (`0 2px 4px rgba(38,38,31,.16), 0 16px 40px rgba(38,38,31,.16)`): placas destacadas y estados elevados.

### Named Rules
**The Flat-By-Default Rule.** Las superficies son planas en reposo; la sombra aparece donde el mundo tiene una placa (CTA, sello, tarjeta). Los hover son cambios de color (brightness/background), no despegue.

## Shapes

Lenguaje de formas casi recto: esquinas de 0.125rem por defecto (radio mínimo), máx 0.5rem. Bordes de 2px sólidos como línea de taller. Los sellos y placas son rectángulos estarcidos sin radio, a veces rotados 1° (rotate-1) para leer estampado. La cinta de medición (MeasureTape) es el único elemento orgánico-geométrico: una SVG de regla industrial con ticks y un bloque naranja "DESPIECE <label>".

### Named Rules
**The Sharp Plate Rule.** Nada de pills ni radios grandes: el mundo es esquinas duras, sellos rectangulares y estarcidos. Un radio ≥ 0.5rem solo en elementos auxiliares.

## Components

### Buttons / CTAs
El CTA es una "orden de corte" estarcida: rectángulo duro, display uppercase.
- **Primary (DISPONIBLE / Cotizar ahora):** relleno Safety Orange, texto On-Orange Ink, padding 16px 32px, sombra plate, hover brightness-95.
- **Outline (A PEDIDO / Consultar disponibilidad):** borde 2px Charcoal Ink, texto Charcoal Ink; hover relleno carbón con texto crema.
- **Dashed (PRÓXIMAMENTE):** borde dashed Wood Bark, texto Wood Bark; expresa estado futuro.

### Stamps (sellos de stock)
Sellos rotados en Archivo bold (14px, uppercase, tracking normal) para máxima legibilidad en un público amplio: DISPONIBLE = placa Safety Orange con On-Orange Ink; A PEDIDO = placa Charcoal Ink; PRÓXIMAMENTE = borde dashed Wood Bark. Identifican el estado por sede sobre el producto. El estarcido queda reservado al bloque DESPIECE de la cinta.

### Cards
Tarjetas de producto y categoría sobre Parchment, borde 2px Outline Pale, sombra plate, radio 0.125rem, canto superior de 2px Charcoal Ink (línea de taller). El badge "Calidad Premium" es una placa crema con texto carbón.

### Inputs / Filters
Inputs rectangulares con borde 2px Outline Sand, fondo Parchment; focus en Safety Orange. Radios y selects de filtro mantienen el mismo borde duro.

### Navigation
Header sticky sobre Parchment; links display uppercase con underline de 3px Safety Orange en estado activo. El menú colapsa las categorías en un único acceso "Productos" (catálogo); el filtro de sede vive en el catálogo y en la ficha de producto, no en el header. En mobile, menú hamburguesa con lista apilada y separadores de 2px; el carrito vive en el header.

### MeasureTape (signature component)
SVG regla industrial con ticks numerados y bloque estarcido "DESPIECE <label>": firma del mundo. Aparece en el hero bajo el tablón, al pie de la ficha técnica del producto y en nosotros. Solo se usa con un dato real (label del producto dimensionado).

## Do's and Don'ts

### Do:
- **Do** escribir toda medida, cota y etiqueta técnica en JetBrains Mono uppercase.
- **Do** usar Safety Orange solo como relleno de acción/sello; para texto naranja elegir Signage Orange (sobre oscuro) o Burnt Signage (sobre crema).
- **Do** mantener esquinas duras (≤0.5rem) y bordes de 2px.
- **Do** rotar los sellos 1° para que lean estampado a mano.
- **Do** escribir los sellos de estado en Archivo bold ≥14px; reservar el estarcido para el bloque DESPIECE.
- **Do** verificar contraste ≥4.5:1 en todo texto nuevo.

### Don't:
- **Don't** usar #e05e16 crudo como texto sobre carbón (falla contraste).
- **Don't** usar pills, radios grandes ni sombras de offset duras.
- **Don't** usar mono como disfraz: sin dato real que medir, va Archivo.
- **Don't** usar texto estarcido por debajo de ~24px (falla legibilidad en público amplio).
- **Don't** presentar fotos Unsplash como material real del proveedor; las etiquetas "Imagen referencial" lo aclaran.
- **Don't** agregar eyebrows o kickers sobre los titulares: el heading lleva su propio peso.
