# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Compradores (público):** personas interesadas en adquirir un terreno (mini-quinta) en el Proyecto Río Bonito, muchas sin acceso a crédito bancario tradicional o historial crediticio formal. Llegan a la landing, exploran el catálogo de lotes y usan el simulador de crédito directo para calcular cuota inicial y cuotas mensuales antes de contactar por WhatsApp o el formulario.

**Equipo interno CADIS (administración y ventas):** administradores que operan el panel admin (contabilidad, cronogramas de pago, documentos, notificaciones por email, log de actividad, importación de propiedades) y vendedores/comisionistas reclutados a través del formulario de reclutamiento, con distintos niveles de experiencia.

## Product Purpose

Plataforma inmobiliaria oficial de CADIS para el Proyecto Río Bonito: permite a compradores simular y solicitar crédito directo (otorgado por CADIS, no por un banco) para adquirir mini-quintas, y da al equipo interno un panel para operar ventas, cobros y equipo comercial. Éxito = leads calificados capturados por el simulador que se convierten en clientes con plan de pago activo, y una operación interna ordenada sobre esos clientes y cobros.

## Positioning

Crédito directo otorgado por CADIS mismo, sin banco ni burocracia de burós de crédito: aprobación más ágil que un crédito hipotecario tradicional, accesible a compradores que un banco rechazaría por falta de historial o ingresos formales. La cuota inicial (30% obligatorio) es fraccionable en 3 cuotas mensuales, bajando la barrera de entrada frente a un pago de contado.

## Operating Context

Proyecto en **venta activa**: hay lotes reales disponibles, un equipo de vendedores en reclutamiento activo y clientes reales usando el simulador. El contacto con clientes se cierra por WhatsApp (widget flotante) y formulario de contacto/newsletter. El panel admin está protegido por login.

**Excel es la fuente de verdad operativa** (`src/data/excel/*.xlsx`: control de ingresos/egresos, comisiones de socios, mini quintas, gastos). La app admin importa/sincroniza propiedades desde esos archivos (`AdminPropertyImportModal`); no asumir que Supabase está en producción como base de datos viva, aunque existe un esquema definido (`supabase_schema.sql`, `supabaseSql.ts`) para una posible migración futura no confirmada.

## Capabilities and Constraints

- **Simulador de crédito:** precio fijo de $8,000 USD para todas las mini-quintas (30% inicial = $2,400 USD; pago de contado o diferido en 3 cuotas mensuales); no hay simulador de precio variable. Plazo de 1 a 8 años (12–96 meses); tasa de interés fija de 10% anual.
- **Mapa interactivo de lotes:** usa el plano real del proyecto (`public/assets/artevld.jpg`) con marcadores superpuestos para los 8 lotes vendibles reales; cada marcador permite Reservar/Comprar/Agendar Visita, deriva a WhatsApp y registra la solicitud en el Panel Admin ("Reservas y Chat").
- **Catálogo/galería de propiedades** (mini-quintas) con estado disponible/reservado/vendido, mapas de referencia y mapa visual del proyecto.
- **Panel admin:** contabilidad, cronograma de pagos por cliente, documentos, notificaciones por email, log de actividad, importación de propiedades desde Excel, resumen y gráficos.
- **Reclutamiento de vendedores** con niveles de experiencia (sin experiencia / intermedio / experimentado).
- Stack existente: React 19 + Vite + TypeScript + Tailwind CSS v4 (ya resuelto por el código, no es una decisión abierta).
- `metadata.json` declara capacidad Gemini API server-side, pero no se encontró uso activo en `src/` — no asumir ni inventar una función de IA en el producto hasta confirmarlo.

## Brand Commitments

Nombre "CADIS" y "Proyecto Río Bonito" son fijos. Enfoque ejecutivo/inmobiliario, mini-quintas, diseño moderno y limpio (definido en CLAUDE.md del proyecto). Logo propio (`CadisLogo.tsx`).

## Evidence on Hand

Datos reales de propiedades, ingresos/egresos, comisiones y gastos viven en los Excel de `src/data/excel/`. No hay testimonios, casos de estudio ni menciones de prensa registrados en el repo — no fabricarlos en trabajo futuro.

## Product Principles

1. El crédito directo sin banco es la promesa central: todo diseño debe reforzar accesibilidad y confianza en ese mecanismo, no ocultarlo detrás de jerga financiera.
2. Excel es la fuente de verdad operativa hoy; cualquier trabajo de UI/datos debe respetar ese flujo de importación en vez de asumir Supabase como base viva.
3. Doble audiencia con objetivos distintos: la experiencia pública prioriza persuasión y conversión (modo Persuade); el panel admin prioriza eficiencia operativa para el equipo interno (modo Operate).
4. Es una operación en venta activa con datos y clientes reales — no fabricar cifras, disponibilidad ni testimonios.
5. El simulador y las preguntas guiadas del chat flotante son flujos con respuestas predefinidas (no IA). Desde 2026-11-26 el chat también tiene un modo "VictoriA" que sí es IA (n8n vía `/api/chat`): llamarlo siempre "asistente virtual (IA)" y nunca hacerlo pasar por una persona. Solo informa; para agendar o reservar deriva a WhatsApp.
