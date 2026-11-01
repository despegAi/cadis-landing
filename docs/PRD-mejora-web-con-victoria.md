# PRD — Mejora de la página web de CADIS con el agente VictoriA

**Versión:** 0.1 (borrador) · **Fecha:** 2026-10-31
**Producto:** Landing y CRM "Mini Quintas Río Bonito" (`CADIS/02-landing-riobonito`)
**Agente:** VictoriA (`CADIS/01-victoria-agente`, n8n + Supabase + WhatsApp Cloud API)
**Estado:** para revisión. Lo no definido está marcado **[PENDIENTE]**; no se inventaron datos.

## 0. Fuentes

- `01-victoria-agente`: `docs/PRD.md`, `PENDIENTES.md` (2026-10-29), `prompts/victoria.md` (v5), `CLAUDE.md`.
- `02-landing-riobonito`: `PRODUCT.md`, `CLAUDE.md`, `src/` (componentes, `config/contact.ts`, `types.ts`), historial de git.
- Dos cifras de la landing salen de lo que dicen `PRODUCT.md` y el PRD del agente (precio USD 8,000 y plazos de 1 a 8 años). No las re-verifiqué línea por línea en el código; es la primera tarea de la Fase 0.

## 1. Problema

VictoriA ya atiende por WhatsApp, calcula cuotas, agenda citas y deriva a asesores. La web, que es la principal fuente de prospectos, trabaja con otras reglas y no está conectada al agente:

1. **Cifras contradictorias.** La landing sigue con precio USD 8,000, inicial USD 2,400 y plazos de 1 a 8 años. VictoriA usa USD 9,000, inicial USD 2,700 (3 cuotas de USD 900) y planes de 2 o 3 años. El PRD del agente cuenta unos 46 lugares con USD 8,000 en el código (P-13). Un prospecto puede ver una cuota en la web y recibir otra por WhatsApp, lo que daña la confianza en un negocio que vende crédito directo.
2. **Puente frágil.** El chat flotante (`WhatsAppFloatingWidget.tsx`) y el mapa de lotes terminan abriendo `wa.me` con un texto prellenado. El agente tiene que interpretar etiquetas como `[CADIS WEB - Lote RB-XX]`. Si el prospecto edita el mensaje, o no envía, el lead se pierde sin rastro.
3. **Lotes sin fuente única.** La web lee `initialData.ts` y archivos Excel; VictoriA lee `ventas.lotes` en Supabase (60 lotes con numeración `M2-05`, no `RB-05`). Un lote puede aparecer disponible en un lado y reservado en el otro.
4. **Sin captura propia de leads.** El simulador y los formularios no escriben en la base que usa VictoriA, así que ella no sabe qué simuló la persona hasta que se lo cuenta.
5. **Sin visibilidad.** El CRM de la web lee Excel y estado local; los leads y citas que VictoriA registra en Supabase no se ven ahí.

**Costo de no resolverlo:** cuotas distintas según el canal, leads perdidos entre la web y WhatsApp, lotes apartados dos veces y trabajo manual para conciliar datos.

## 2. Objetivos

| # | Objetivo | Medida |
|---|---|---|
| G1 | Una sola verdad comercial: la web y VictoriA muestran las mismas cifras | 0 discrepancias de precio, inicial, plazo, tasa y tipo de cambio en una auditoría de las dos fuentes |
| G2 | Que los leads de la web lleguen a VictoriA con contexto, sin depender del texto de `wa.me` | ≥ 90 % de los contactos web llegan con lote/simulación asociados al lead |
| G3 | Que el estado de los lotes sea el mismo en la web y en el agente | 0 lotes con estado distinto entre mapa y `ventas.lotes` |
| G4 | Subir la conversión de visita web a cita agendada | Meta a fijar tras medir la línea base **[PENDIENTE]** |
| G5 | Que el equipo vea en un solo lugar los leads, citas y pre-reservas generados por web y WhatsApp | El CRM de la web muestra los leads de Supabase con las 5 etapas |

## 3. No-objetivos

- **Reemplazar WhatsApp por un chat web con IA en esta fase.** Primero se unifican datos y flujo; un chat embebido es una Fase 3 opcional.
- **Cobrar o procesar pagos en la web.** Fuera de alcance igual que en el agente.
- **Rehacer el panel admin** (contabilidad, documentos, correos). Solo se conecta el CRM de leads.
- **Migrar toda la operación de Excel a Supabase.** Solo lotes y leads; contabilidad y comisiones siguen en Excel hasta nueva decisión.
- **Ofrecer planes de 5 u 8 años.** Quedan para proyectos futuros, según Carlos Andia (PENDIENTES 2026-09-27).

## 4. Usuarios e historias

**Prospecto (público)**
- Como prospecto, quiero ver en la web la misma cuota que me dará VictoriA, para confiar en el crédito directo.
- Como prospecto, quiero tocar un lote en el mapa y que mi interés llegue a VictoriA sin escribir nada, para que me atiendan ya sabiendo qué quiero.
- Como prospecto, quiero guardar mi simulación y continuar por WhatsApp, para no repetir mis datos.
- Como prospecto sin tiempo, quiero agendar una visita en pocos pasos, para no depender de una larga conversación.
- *Caso límite:* si el lote que toco ya no está disponible, quiero verlo claro y que me ofrezcan otros, no un error.

**Equipo CADIS (admin y asesores)**
- Como administrador, quiero ver en el CRM los leads que entran por web y por WhatsApp con su etapa, para no revisar dos sitios.
- Como administrador, quiero cambiar precio, tasa y tipo de cambio en un solo lugar (`public.parametros`), para que web y agente se actualicen juntos.
- Como asesor, quiero ver el origen del lead (mapa, simulador, formulario, WhatsApp directo) y su ficha, para llegar a la cita preparado.

## 5. Requisitos

### P0 — Sin esto no se lanza

**R1. Parámetros comerciales desde una sola fuente.**
La web lee precio, inicial (%), tasa anual, plazos permitidos y tipo de cambio de `public.parametros` en Supabase (lectura pública limitada vía vista o función segura), en lugar de constantes en el código.
- [ ] Cambiar `precio_lote_usd` en Supabase cambia el simulador, el hero y las tarjetas sin tocar código.
- [ ] El simulador solo ofrece 2 y 3 años de plazo.
- [ ] La inicial se muestra como 30 % = USD 2,700 en 3 cuotas de USD 900 sin interés.
- [ ] No quedan literales de USD 8,000 / 2,400 en `src/` fuera de históricos de contabilidad.
- [ ] Si Supabase no responde, la web muestra un aviso discreto y no cifras viejas.

**R2. Misma fórmula que el agente.**
El simulador usa la amortización francesa con la tasa de `parametros`, y su resultado coincide con `ventas.calcular_cuota(plan)` al centavo.
- [ ] Prueba automatizada con planes de 2 y 3 años que compara el simulador con la función SQL.
- [ ] Las cifras de referencia del PRD del agente (cuota de 2 años USD 290.65; 3 años USD 203.28) se cumplen **mientras los parámetros sigan igual**.

**R3. Lotes con fuente única.**
El mapa interactivo y la galería leen `ventas.v_lotes` (o una vista pública equivalente) con estados Disponible, Reservado, Vendido y marca `prereservado`.
- [ ] La numeración mostrada coincide con `ventas.lotes` (`M2-05`).
- [ ] Los 60 lotes cargados aparecen con su estado real.
- [ ] La web no escribe estados `reservado` ni `vendido`: esa transición es humana (regla 8.2 del agente).

**R4. Captura de lead con contexto antes de abrir WhatsApp.**
Cada acción del mapa (reservar, comprar, agendar visita), el simulador y el formulario de contacto crean o actualizan un registro en Supabase (`leads` con `origen`) y luego abren WhatsApp con un mensaje corto y un identificador de contexto.
- [ ] El lead guarda origen (`mapa_interactivo`, `simulador`, `formulario`, `whatsapp_directo`), lote, plan y cuota simulados.
- [ ] Un mismo teléfono no genera duplicados (upsert).
- [ ] VictoriA recibe el contexto por identificador y **no vuelve a preguntar** lo que el lead ya trae.
- [ ] La escritura pasa por una función o endpoint con límite de frecuencia; la web nunca usa `service_role`.

**R5. Pre-reserva desde el mapa conectada al agente.**
La acción "reservar/comprar" llama a `ventas.registrar_prereserva` y muestra el resultado real (`ok`, `ya_prereservado`, `lote_no_disponible`).
- [ ] El texto de la web dice **pre-reserva**, con el vencimiento vigente, y nunca "reservado".
- [ ] Dos personas no pueden apartar el mismo lote a la vez (bloqueo atómico existente).
- [ ] "Agendar visita" no bloquea el lote.

**R6. Un solo número y un solo mensaje base.**
Todos los enlaces a WhatsApp usan `CADIS_WHATSAPP_NUMBER` de `config/contact.ts` y el número que atiende VictoriA.
- [ ] Ningún `wa.me` con número fijo en componentes (hoy `CreditSimulator.tsx` tiene `59163560078` escrito).
- [ ] Los mensajes prellenados usan la etiqueta y el formato que el prompt de VictoriA (sección 5) entiende, o el identificador del R4.

### P1 — Mejoran mucho la experiencia

**R7. Agenda de visita desde la web.** Selector de fecha, hora y tipo (visita o reunión) que crea el agendamiento y pasa el lead a *Cita Agendada*. Depende de definir disponibilidad **[PENDIENTE]** (PRD agente RF-3).

**R8. CRM del admin leyendo Supabase.** El tablero Kanban lee `ventas.leads` con las 5 etapas (Nuevo → Contactado → Cita Agendada → Reservado → Vendido), muestra asesor asignado y origen, y permite a una persona mover a *Reservado* / *Vendido*. Mantiene la importación desde Excel como respaldo.

**R9. Continuidad de la simulación.** "Seguir por WhatsApp" envía la simulación guardada; VictoriA la recoge y la **recalcula con su tool** antes de citar cifras.

**R10. Estado de la cuenta del cliente.** Solo cuando exista `Tool_Consultar_Estado_Pago` (RF-5 del agente, bloqueado por P-17). No se diseña aquí.

### P2 — Consideraciones futuras

- **Chat web con VictoriA** (misma lógica y prompt, canal web). Hoy el chat flotante es un flujo guiado y `PRODUCT.md` prohíbe llamarlo IA; ese principio debe actualizarse si se hace.
- Verificación de firma `X-Hub-Signature-256` del webhook de Meta.
- Flujo para quien se postula como asesor inmobiliario (P-14).
- Evento de analítica por paso del embudo.

## 6. Diseño y datos (resumen)

```
Web (React/Vite)
  ├─ lee:  public.parametros (precio, tasa, tipo de cambio)     [R1]
  │        ventas.v_lotes   (estado de lotes)                    [R3]
  └─ escribe vía función segura (sin service_role en el navegador):
           ventas.leads (origen, lote, plan, cuota)              [R4]
           ventas.registrar_prereserva(...)                      [R5]
           ventas.agendamientos                                  [R7]
                    │
                    ▼
        Supabase  ◄──────────►  n8n / VictoriA (WhatsApp)
                    │
                    ▼
        CRM admin (lee ventas.leads)                             [R8]
```

- Reutilizar las funciones atómicas existentes; no duplicar lógica en el cliente.
- RLS activo en toda tabla nueva. La web solo recibe vistas o funciones con los campos mínimos (nunca teléfonos de asesores ni datos de otros clientes).
- Los datos personales ya se quitaron del código público (commit `e5ded3f`); no reintroducirlos.
- Las tablas de apoyo y funciones están descritas en la sección 7 del PRD del agente.

## 7. Métricas

**Indicadores adelantados (días a semanas)**

| Métrica | Fuente | Meta |
|---|---|---|
| Discrepancias de cifras web vs agente | Auditoría + prueba automatizada de R2 | 0 |
| % de contactos web con lead creado antes de abrir WhatsApp | Supabase (`origen` ≠ `whatsapp_directo`) | ≥ 90 % |
| Mensajes en que VictoriA repite una pregunta ya contestada en la web | Revisión de muestra de conversaciones | < 5 % |
| Errores de pre-reserva por lote ya apartado | Logs | Seguimiento, sin meta |

**Indicadores rezagados (semanas a meses)**

| Métrica | Fuente | Meta |
|---|---|---|
| Conversión visita web → cita agendada | Embudo web + `agendamientos` | Fijar tras 4 semanas de línea base **[PENDIENTE]** |
| Citas asistidas / agendadas | CRM | **[PENDIENTE]** |
| Tiempo de primer mensaje a cita asignada | Supabase | **[PENDIENTE]** |

No hay línea base medida hoy, por eso las metas de conversión quedan abiertas en vez de inventarlas.

## 8. Preguntas abiertas

| # | Pregunta | Quién | ¿Bloquea? |
|---|---|---|---|
| Q1 | ¿La web lee `parametros` y `v_lotes` directo con clave `anon` y vistas de solo lectura, o por un endpoint propio? | Ingeniería | Sí, para R1/R3 |
| Q2 | ¿El tipo de cambio es 8 Bs por USD también en la web? (la web usaba otro valor; confirmar). | Negocio (Carlos Andia) | Sí, para R1 |
| Q3 | Fuente de verdad de lotes: Supabase o Excel (P-5). Este PRD propone Supabase para lotes y deja Excel para contabilidad. | Dirección CADIS | Sí |
| Q4 | Duración de la pre-reserva y qué pasa al vencer (P-15; propuesta 24 h). | Negocio | Para R5 |
| Q5 | ¿VictoriA dice al cliente el nombre del asesor asignado? (P-16). | Negocio | No |
| Q6 | Reglas de disponibilidad para citas (días, horarios, cupo por asesor). | Negocio | Para R7 |
| Q7 | Número de WhatsApp en producción: la app de Meta sigue sin publicar y VictoriA corre con número de prueba. | Dirección / Meta | Sí, para lanzar |
| Q8 | ¿Se actualiza `PRODUCT.md` para reflejar que la web ya no es solo flujos guiados? | Producto | No |
| Q9 | Proceso para postulantes a asesor (P-14). | Negocio | No |

## 9. Fases y dependencias

| Fase | Contenido | Dependencias |
|---|---|---|
| **0 — Alinear cifras** (corta) | Auditar y reemplazar USD 8,000/2,400 y plazos 1–8 años; centralizar en una constante o en `parametros`; quitar el `wa.me` fijo del simulador | Respuesta Q2. Sin Supabase todavía: es el arreglo inmediato de G1 |
| **1 — Fuente única** | R1, R2, R3, R6 | Q1, Q3; vistas públicas en Supabase |
| **2 — Puente web ↔ agente** | R4, R5; ajustes de prompt para leer el contexto | Fase 1; Q4; número de producción (Q7) |
| **3 — Experiencia y operación** | R7, R8, R9 | Q6; Fase 2 |
| **Futuro** | P2 | Decisión de producto |

**Plazos:** sin fecha límite firme documentada **[PENDIENTE]**. Sí hay una dependencia externa que condiciona el lanzamiento real: la verificación del negocio en Meta, que lleva días de trámite (PENDIENTES.md).

## 10. Riesgos

- **Cambiar precios en una web en venta activa** puede romper material ya difundido (brochures PDF, correos). Revisar `pdfBrochureGenerator.ts` y `emailNotificationManager.ts`, que también llevan cifras.
- **Escritura pública desde el navegador** es un vector de spam y de datos falsos: exigir límite de frecuencia y validación del lado del servidor.
- **Supabase Free** pausa proyectos tras una semana sin actividad; si se pausa, la web pierde precios y lotes (R1/R3). Definir el plan antes de producción.
- **Sincronizar dos repositorios** (`01-victoria-agente` y `02-landing-riobonito`) exige que los cambios de esquema vayan como migraciones versionadas y que se revisen en conjunto.
- La app de Meta sin publicar solo permite enviar a números de prueba: no se puede validar el flujo completo con clientes reales todavía.
