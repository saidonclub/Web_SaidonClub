# SAIDONCLUB — ESPECIFICACIÓN TÉCNICA MAESTRA v3.0
## Documento Unificado, Completo y Perfeccionado
### Sistema Marketplace Híbrido: Servicios Profesionales + Productos + MLM + Wallet

---

> **INSTRUCCIÓN PARA EL AGENTE:** Este es el documento maestro definitivo. Reemplaza y supera todos los documentos anteriores. Contiene **TODOS** los módulos del sistema, conectados entre sí, sin huecos, sin ambigüedades, sin módulos huérfanos. Lee la totalidad antes de escribir una sola línea de código. El orden de implementación está en la PARTE 9. Nunca asumas nada que no esté escrito aquí. Nunca rompas los principios inquebrantables de la PARTE 0.

---

# ÍNDICE

- [PARTE 0 — Contexto, Stack y Principios del Sistema](#parte-0)
- [PARTE 1 — Arquitectura Global de Servicios](#parte-1)
- [PARTE 2 — Modelo de Datos Completo (Prisma Schema)](#parte-2)
- [PARTE 3 — API Routes Completas (Backend)](#parte-3)
- [PARTE 4 — Flujos de Negocio Detallados](#parte-4)
- [PARTE 5 — Lógica Financiera Interna (ACID)](#parte-5)
- [PARTE 6 — Event-Driven System (Cola de Eventos)](#parte-6)
- [PARTE 7 — Frontend / Páginas y Componentes](#parte-7)
- [PARTE 8 — Sistema de Notificaciones Multi-canal](#parte-8)
- [PARTE 9 — Documentos Legales Dinámicos](#parte-9)
- [PARTE 10 — Pruebas Automatizadas Requeridas](#parte-10)
- [PARTE 11 — Guía de Implementación Paso a Paso](#parte-11)
- [PARTE 12 — Reglas Inquebrantables del Sistema](#parte-12)
- [PARTE 13 — Variables de Entorno y Configuración](#parte-13)

---

<a name="parte-0"></a>
# PARTE 0 — CONTEXTO, STACK Y PRINCIPIOS DEL SISTEMA

## 0.1 Stack Tecnológico (NO CAMBIAR)

```
Framework:      Next.js 14 con App Router + Server Actions
Base de datos:  PostgreSQL vía Prisma ORM
Auth:           Sistema existente con roles y PIN de seguridad
Backend:        API Routes RESTful ya implementadas
MLM Engine:     @saidonclub/mlm-engine (paquete externo ya funcional)
Monorepo:
  apps/web/               → Frontend Next.js
  packages/database/      → Prisma schema
  packages/mlm-engine/    → Motor MLM (NO TOCAR)
  packages/rbac/          → Control de acceso por roles
  packages/config-engine/ → Configuraciones del sistema
  packages/notifications/ → (NUEVO) Servicio de notificaciones multi-canal
```

## 0.2 Módulos Ya Implementados (NO TOCAR)

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Auth + Roles | ✅ ACTIVO | 9 roles: CLIENT, PREFERENTE, PIONERO, PROVIDER, ADMIN, SUPER_ADMIN, ACCOUNTANT, SUPPORT |
| Wallet P2P | ✅ ACTIVO | Transferencias, retiros, PIN de seguridad |
| MLM Engine | ✅ ACTIVO | Genealogía, regalías, rangos, cierre semanal |
| Marketplace Productos | ✅ ACTIVO | Carrito, 9 métodos de pago |
| Dashboard Usuario | ✅ ACTIVO | Árbol de red visual |

## 0.3 Módulos a Construir en Este Sprint

| # | Módulo | Prioridad | Estimado |
|---|--------|-----------|----------|
| 1 | Service Marketplace Engine | 🔴 CRÍTICO | 8 días |
| 2 | Booking + Negotiation Engine | 🔴 CRÍTICO | 3 días |
| 3 | QR Validation System | 🔴 CRÍTICO | 1 día |
| 4 | Universal Service Form (Bipartito) | 🔴 CRÍTICO | 2 días |
| 5 | Billing Integration (IVA 15%) | 🔴 CRÍTICO | 2 días |
| 6 | KYC Avanzado para Proveedores | 🟠 IMPORTANTE | 2 días |
| 7 | Sistema de Beneficiarios Familiares | 🟠 IMPORTANTE | 1 día |
| 8 | Sistema de Reputación Bidireccional | 🟠 IMPORTANTE | 1 día |
| 9 | Agenda Inteligente del Proveedor | 🟠 IMPORTANTE | 1 día |
| 10 | Notificaciones Multi-canal | 🟡 MEJORA | 1 día |
| 11 | Dashboard Métricas Admin | 🟡 MEJORA | 2 días |
| 12 | Documentos Legales Dinámicos | 🟡 MEJORA | 1 día |
| 13 | Sistema de Moderación y Sanciones | 🟡 MEJORA | 1 día |

## 0.4 Principios Inquebrantables del Diseño

```
1. Todo nace del consumo real → sin evento real, sin registro
2. Todo debe ser trazable → si no está en la DB, no ocurrió
3. Todo flujo cierra → inicio → ejecución → validación → registro → impacto económico
4. No existen módulos huérfanos → todo está conectado al wallet, MLM y billing
5. Toda operación financiera es ACID → transacciones Prisma atómicas
6. El internalPrice NUNCA llega al frontend público
7. Los cálculos de precio SIEMPRE en servidor
8. Separación total: Productos vs Servicios (flujos distintos, sin carrito en servicios)
```

---

<a name="parte-1"></a>
# PARTE 1 — ARQUITECTURA GLOBAL DE SERVICIOS

## 1.1 Mapa de Microservicios (Monorepo)

```
┌─────────────────────────────────────────────────────────────┐
│                    SAIDONCLUB CORE                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Auth Service │ User Service │ RBAC Service │ Config Engine  │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                    SERVICIOS FINANCIEROS                    │
├──────────────┬──────────────┬──────────────┬────────────────┤
│Wallet Service│  MLM Engine  │Billing Svc   │  KYC Service   │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                   MARKETPLACES                              │
├──────────────────────────┬──────────────────────────────────┤
│  Product Marketplace     │  SERVICE MARKETPLACE ENGINE      │
│  (YA EXISTE)             │  ← MÓDULO PRINCIPAL A CONSTRUIR  │
├──────────────────────────┴──────────────────────────────────┤
│              SERVICE MARKETPLACE ENGINE                     │
├──────────┬───────────┬───────────┬────────────┬────────────┤
│ Provider │  Booking  │Negotiation│    QR      │ Bipartite  │
│ Registry │  Engine   │  Engine   │ Validator  │   Form     │
├──────────┴───────────┴───────────┴────────────┴────────────┤
│              SERVICIOS DE SOPORTE                          │
├──────────────┬──────────────┬──────────────────────────────┤
│ Notification │  Review &    │   Moderation &               │
│   Service    │  Reputation  │   Sanctions                  │
└──────────────┴──────────────┴──────────────────────────────┘
```

## 1.2 Flujo de Estados de una Cita (State Machine)

```
SOLICITUD:
  [CLIENTE] → POST /api/appointments → Appointment(PENDING_PROVIDER)
                                              ↓
NEGOCIACIÓN:
  [PROVEEDOR] propone horarios        → Appointment(PROVIDER_RESPONDED)
                                              ↓
  [CLIENTE] elige horario             → Appointment(PENDING_CLIENT)
                                              ↓
CONFIRMACIÓN:
  Sin prepago                         → Appointment(CONFIRMED)
  Con prepago                         → Appointment(PENDING_CLIENT)
                                              ↓
  [CLIENTE] paga                      → Appointment(PAID)
                                              ↓
EJECUCIÓN:
  [PROVEEDOR] escanea QR              → Appointment(IN_PROGRESS)
                                              ↓
  [PROVEEDOR] llena Bipartito         → BipartiteForm(PENDING_CLIENT_ACCEPTANCE)
                                              ↓
  [CLIENTE] acepta                    → BipartiteForm(BOTH_SIGNED)
                                              ↓ (ACID transaction)
  Sistema auto-ejecuta:               → Appointment(COMPLETED)
    → ServiceInvoice generada          → Wallet proveedor acreditado
    → Comisión empresa registrada      → Eventos disparados
    → Notificaciones enviadas          → MLM Engine notificado
                                              ↓
POST-PROCESO:
  72h después                         → Review requests enviadas
```

## 1.3 Separación Productos vs Servicios

| Aspecto | Productos | Servicios |
|---------|-----------|-----------|
| Flujo de compra | Carrito → Checkout | Booking → Negociación → Ejecución |
| Pago | Siempre en plataforma | Pre o post servicio |
| Validación de entrega | Confirmación de envío | QR + Formulario Bipartito |
| Devoluciones | Política de devoluciones | Sin devoluciones (prepago) |
| Factura | Automática | Requiere BipartiteForm firmado |
| Comisión | Directa sobre precio | memberPrice - internalPrice |

---

<a name="parte-2"></a>
# PARTE 2 — MODELO DE DATOS COMPLETO (PRISMA SCHEMA)

> **INSTRUCCIÓN:** Agrega los siguientes modelos a `packages/database/schema.prisma`. Ejecuta `prisma migrate dev --name add-services-marketplace` al finalizar. Valida con `prisma validate` antes de migrar.

## 2.1 Perfil del Proveedor de Servicios

```prisma
model ServiceProvider {
  id                    String               @id @default(cuid())
  userId                String               @unique
  user                  User                 @relation(fields: [userId], references: [id])

  // === ESTADO Y VERIFICACIÓN ===
  status                ProviderStatus       @default(PENDING_KYC)
  kycStatus             KycStatus            @default(NOT_STARTED)
  kycSubmittedAt        DateTime?
  kycApprovedAt         DateTime?
  kycApprovedByUserId   String?
  kycRejectionReason    String?

  // === INFORMACIÓN PROFESIONAL ===
  businessName          String
  profession            String               // Ej: "Médico General", "Abogado Corporativo"
  professionCategory    ProfessionCategory
  licenseNumber         String?
  licenseIssuedBy       String?
  licenseExpiresAt      DateTime?
  bio                   String?              @db.VarChar(1000)

  // === CONTACTO Y UBICACIÓN ===
  phone                 String
  email                 String
  whatsapp              String?
  telegram              String?
  website               String?
  instagram             String?
  facebook              String?
  tiktok                String?
  address               String?
  city                  String?
  province              String?
  latitude              Float?
  longitude             Float?

  // === FOTOS (URLs en Supabase Storage) ===
  profilePhotoUrl       String?
  personalPhotos        String[]             @default([])  // Máx 3
  workPhotos            String[]             @default([])  // Máx 3
  businessPhotos        String[]             @default([])  // Máx 3
  adPhotos              String[]             @default([])  // Ilimitadas

  // === DOCUMENTOS KYC (URLs) ===
  idDocumentUrl         String?
  idDocumentBackUrl     String?
  professionalTitleUrl  String[]             @default([])
  certificationUrls     String[]             @default([])
  selfieWithIdUrl       String?

  // === KYC POR CATEGORÍA (JSON flexible) ===
  // Para HEALTH: { senescytNumber, university, graduationYear, acesNumber? }
  // Para LEGAL: { forumNumber, titleType }
  // Para ARCHITECTURE/ENGINEERING: { ciapNumber }
  categoryKycData       Json?

  // === CONVENIO ===
  agreementNumber       String?              @unique  // "SC-CONV-YYYYMM-NNNNNN"
  agreementSignedAt     DateTime?
  agreementDocUrl       String?

  // === RELACIONES ===
  services              ServiceListing[]
  appointments          Appointment[]
  schedules             ProviderSchedule[]
  blockedDates          ProviderBlockedDate[]
  providerReviews       ProviderReview[]
  clientReviews         ClientReview[]
  warnings              ProviderWarning[]
  transactions          WalletTransaction[]  // Relacionado al wallet existente

  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt

  @@index([city, professionCategory])
  @@index([status, kycStatus])
  @@map("service_providers")
}

enum ProviderStatus {
  PENDING_KYC        // Registrado, sin documentos
  PENDING_APPROVAL   // KYC enviado, esperando revisión admin
  ACTIVE             // Aprobado, puede publicar servicios
  SUSPENDED_TEMP     // Suspensión temporal
  SUSPENDED_PERM     // Suspensión permanente
  REJECTED           // Solicitud rechazada
  REQUIRES_UPDATE    // Admin solicitó correcciones
}

enum KycStatus {
  NOT_STARTED
  IN_PROGRESS
  SUBMITTED
  APPROVED
  REJECTED
  REQUIRES_UPDATE
}

enum ProfessionCategory {
  HEALTH          // Salud
  LEGAL           // Legal / Jurídico
  ARCHITECTURE    // Arquitectura
  ENGINEERING     // Ingeniería
  FINANCIAL       // Contabilidad / Finanzas
  EDUCATION       // Educación / Coaching
  BEAUTY          // Estética / Belleza
  TECHNOLOGY      // TI / Tecnología
  HOME_SERVICES   // Servicios del hogar
  OTHER
}
```

## 2.2 Listado de Servicios

```prisma
model ServiceListing {
  id                    String               @id @default(cuid())
  providerId            String
  provider              ServiceProvider      @relation(fields: [providerId], references: [id])

  // === IDENTIFICACIÓN ===
  name                  String
  description           String               @db.Text
  category              ServiceCategory
  isActive              Boolean              @default(true)
  requiresApproval      Boolean              @default(false)

  // === TRES NIVELES DE PRECIO (CRÍTICO) ===
  // REGLA INMUTABLE: internalPrice < memberPrice < publicPrice
  publicPrice           Decimal              @db.Decimal(10, 2)  // Visible para todos
  memberPrice           Decimal              @db.Decimal(10, 2)  // Solo miembros PREFERENTE/PIONERO
  internalPrice         Decimal              @db.Decimal(10, 2)  // NUNCA al frontend

  // === COMISIÓN (calculado en servidor, nunca en cliente) ===
  companyCommission     Decimal              @db.Decimal(10, 2)  // = memberPrice - internalPrice
  commissionPercentage  Decimal              @db.Decimal(5, 2)   // Para reportes

  // === IVA (Ecuador) ===
  ivaPercentage         Decimal              @db.Decimal(5, 2)   @default(15.00)
  ivaIncluded           Boolean              @default(false)

  // === MODALIDAD ===
  modality              ServiceModality
  duration              Int                  // Duración en minutos
  allowEmergency        Boolean              @default(false)
  emergencySurcharge    Decimal?             @db.Decimal(10, 2)

  // === PREPAGO ===
  requiresPrePayment    Boolean              @default(false)

  // === CAMBIOS PENDIENTES (requiere aprobación admin) ===
  pendingUpdate         Json?

  // === RELACIONES ===
  appointments          Appointment[]
  reviews               ProviderReview[]

  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt

  @@index([category, isActive])
  @@index([providerId, isActive])
  @@map("service_listings")
}

enum ServiceCategory {
  MEDICAL_CONSULTATION
  DENTAL
  PSYCHOLOGY
  PHYSIOTHERAPY
  NUTRITION
  OPTOMETRY
  LEGAL_CONSULTATION
  NOTARY
  ARCHITECTURAL_DESIGN
  ENGINEERING_CONSULTING
  ACCOUNTING
  FINANCIAL_ADVISORY
  TUTORING
  COACHING
  HAIRCUT_STYLING
  AESTHETIC_TREATMENT
  MASSAGE_THERAPY
  WEB_DEVELOPMENT
  GRAPHIC_DESIGN
  TECHNICAL_SUPPORT
  PLUMBING
  ELECTRICAL
  CARPENTRY
  CLEANING_SERVICE
  OTHER
}

enum ServiceModality {
  PRESENCIAL    // En el local del proveedor
  VIRTUAL       // Videollamada
  DOMICILIO     // El proveedor va donde el cliente
}
```

## 2.3 Beneficiarios Familiares

```prisma
model FamilyBeneficiary {
  id                    String               @id @default(cuid())
  memberId              String
  member                User                 @relation("MemberBeneficiaries", fields: [memberId], references: [id])

  // === DATOS PERSONALES ===
  firstName             String
  lastName              String
  relationship          FamilyRelationship
  dateOfBirth           DateTime
  idDocumentNumber      String
  idDocumentType        IdDocumentType       @default(CEDULA)

  // === DOCUMENTOS ===
  photoUrl              String?
  idDocumentUrl         String?
  idDocumentBackUrl     String?

  // === ESTADO ===
  isActive              Boolean              @default(true)
  verifiedAt            DateTime?
  verifiedByUserId      String?

  appointments          Appointment[]

  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt

  // Un mismo número de documento no puede aparecer dos veces en la misma cuenta
  @@unique([memberId, idDocumentNumber])
  @@map("family_beneficiaries")
}

enum FamilyRelationship {
  SPOUSE
  CHILD
  PARENT
  SIBLING
  OTHER
}

enum IdDocumentType {
  CEDULA
  PASSPORT
  FOREIGN_ID
}
```

## 2.4 Sistema de Citas (Appointment — State Machine Central)

```prisma
model Appointment {
  id                        String               @id @default(cuid())

  // === PARTES ===
  clientId                  String
  client                    User                 @relation("ClientAppointments", fields: [clientId], references: [id])
  beneficiaryId             String?
  beneficiary               FamilyBeneficiary?   @relation(fields: [beneficiaryId], references: [id])
  providerId                String
  provider                  ServiceProvider      @relation(fields: [providerId], references: [id])
  serviceId                 String
  service                   ServiceListing       @relation(fields: [serviceId], references: [id])

  // === STATE MACHINE ===
  status                    AppointmentStatus    @default(PENDING_PROVIDER)
  /*
  Estado              Acción que lo origina
  ─────────────────────────────────────────────────────────
  PENDING_PROVIDER  → Cliente crea solicitud
  PROVIDER_RESPONDED→ Proveedor propone horarios
  PENDING_CLIENT    → Sistema espera al cliente elegir horario
  CONFIRMED         → Cliente confirmó (sin prepago)
  PENDING_PAYMENT   → Cliente confirmó (con prepago, espera pago)
  PAID              → Pago recibido (solo prepago)
  IN_PROGRESS       → Proveedor escaneó QR
  COMPLETED         → BipartiteForm firmado por ambos
  CANCELLED_CLIENT  → Cancelado por cliente (solo si no hay pago)
  CANCELLED_PROVIDER→ Cancelado por proveedor
  NO_SHOW           → Cliente no se presentó
  EMERGENCY         → Cita de emergencia
  DISPUTE           → Disputa activa
  */

  isEmergency               Boolean              @default(false)
  emergencyReason           String?

  // === FECHAS ===
  requestedDate             DateTime?
  requestedTimeSlot         String?              // "09:00-10:00"
  proposedSlots             Json?                // [{date, time, available}]
  confirmedDate             DateTime?
  actualStartTime           DateTime?            // Al escanear QR
  actualEndTime             DateTime?            // Al firmar bipartito

  // === NOTAS ===
  clientNotes               String?
  providerNotes             String?

  // === SNAPSHOT DE PRECIOS (inmutable tras confirmación) ===
  appliedPublicPrice        Decimal              @db.Decimal(10, 2)
  appliedMemberPrice        Decimal              @db.Decimal(10, 2)
  appliedInternalPrice      Decimal              @db.Decimal(10, 2)
  appliedIvaPercentage      Decimal              @db.Decimal(5, 2)
  ivaAmount                 Decimal?             @db.Decimal(10, 2)
  totalCharged              Decimal?             @db.Decimal(10, 2)
  companyCommissionAmount   Decimal?             @db.Decimal(10, 2)
  providerNetAmount         Decimal?             @db.Decimal(10, 2)

  // === PAGO ===
  paymentMethod             String?
  paymentId                 String?
  paymentStatus             PaymentStatus?       @default(PENDING)
  paidAt                    DateTime?

  // === RELACIONES ===
  bipartiteForm             BipartiteForm?
  invoice                   ServiceInvoice?
  providerReview            ProviderReview?
  clientReview              ClientReview?
  auditLog                  AppointmentAuditLog[]

  createdAt                 DateTime             @default(now())
  updatedAt                 DateTime             @updatedAt

  @@index([clientId, status])
  @@index([providerId, status])
  @@index([confirmedDate])
  @@map("appointments")
}

enum AppointmentStatus {
  PENDING_PROVIDER
  PROVIDER_RESPONDED
  PENDING_CLIENT
  CONFIRMED
  PENDING_PAYMENT
  PAID
  IN_PROGRESS
  COMPLETED
  CANCELLED_CLIENT
  CANCELLED_PROVIDER
  NO_SHOW
  EMERGENCY
  DISPUTE
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

// Log de auditoría de cada transición de estado
model AppointmentAuditLog {
  id              String      @id @default(cuid())
  appointmentId   String
  appointment     Appointment @relation(fields: [appointmentId], references: [id])
  fromStatus      String
  toStatus        String
  triggeredByRole String      // Quién disparó el cambio
  triggeredById   String?
  reason          String?
  metadata        Json?
  createdAt       DateTime    @default(now())

  @@map("appointment_audit_logs")
}
```

## 2.5 Formulario Bipartito Digital

```prisma
model BipartiteForm {
  id                        String               @id @default(cuid())
  appointmentId             String               @unique
  appointment               Appointment          @relation(fields: [appointmentId], references: [id])

  // === FASE 1: PROVEEDOR LLENA ===
  serviceDescription        String               @db.Text
  additionalServicesGiven   Json?                // [{name, price, quantity}]
  baseServiceValue          Decimal              @db.Decimal(10, 2)
  extraServicesValue        Decimal              @db.Decimal(10, 2)  @default(0)
  totalServiceValue         Decimal              @db.Decimal(10, 2)  // base + extras
  ivaApplied                Decimal              @db.Decimal(10, 2)
  totalWithIva              Decimal              @db.Decimal(10, 2)
  paymentTypeUsed           FormPaymentType

  providerObservations      String?              @db.Text
  isObservationPrivate      Boolean              @default(false)

  // === DECLARACIÓN DEL PROVEEDOR ===
  providerDeclares          String               @db.Text
  providerSignedAt          DateTime?
  providerSignatureData     String?              // "ACCEPTED_DIGITALLY" o base64
  providerIpAddress         String?
  providerUserAgent         String?

  // === FASE 2: CLIENTE ACEPTA ===
  clientDeclares            String?              @db.Text
  clientAcceptedAt          DateTime?
  clientSignatureData       String?
  clientIpAddress           String?
  clientUserAgent           String?

  // Si el cliente rechaza:
  clientRejectedAt          DateTime?
  clientRejectionReason     String?

  // === ESTADO ===
  formStatus                BipartiteFormStatus  @default(PROVIDER_FILLING)

  // === MEMBRESÍA APLICADA (para calcular descuento) ===
  membershipDiscountApplied Boolean              @default(false)
  discountAmount            Decimal?             @db.Decimal(10, 2)

  createdAt                 DateTime             @default(now())
  updatedAt                 DateTime             @updatedAt

  @@map("bipartite_forms")
}

enum FormPaymentType {
  PLATFORM_PREPAID    // Pagado en plataforma antes del servicio
  DIRECT_CASH         // Efectivo al proveedor
  DIRECT_CARD         // Tarjeta al proveedor
  PLATFORM_POINTS     // Puntos SaidonClub
}

enum BipartiteFormStatus {
  PROVIDER_FILLING           // Proveedor llenando el formulario
  PENDING_CLIENT_ACCEPTANCE  // Enviado al cliente, esperando respuesta
  BOTH_SIGNED                // Completado, dispara facturación
  DISPUTED                   // Cliente rechazó, en disputa
}
```

## 2.6 Facturación de Servicios

```prisma
model ServiceInvoice {
  id                        String               @id @default(cuid())
  appointmentId             String               @unique
  appointment               Appointment          @relation(fields: [appointmentId], references: [id])

  // === NÚMERO SECUENCIAL ===
  invoiceNumber             String               @unique
  // Formato: SC-SRV-{YYYY}{MM}-{000001}

  issuedAt                  DateTime             @default(now())

  // === PARTES ===
  providerLegalName         String
  providerRuc               String?
  providerAgreementNumber   String
  clientLegalName           String
  clientIdDocument          String
  clientIdType              String

  // === DETALLE FINANCIERO ===
  subtotal                  Decimal              @db.Decimal(10, 2)
  ivaPercentage             Decimal              @db.Decimal(5, 2)
  ivaAmount                 Decimal              @db.Decimal(10, 2)
  total                     Decimal              @db.Decimal(10, 2)

  // === DATOS INTERNOS (SOLO ADMIN/ACCOUNTANT) ===
  companyCommission         Decimal              @db.Decimal(10, 2)
  providerNetPayment        Decimal              @db.Decimal(10, 2)
  agreementInternalPrice    Decimal              @db.Decimal(10, 2)

  // === ESTADO Y ENTREGA ===
  invoiceStatus             InvoiceStatus        @default(ISSUED)
  pdfUrl                    String?
  sentToClientAt            DateTime?
  sentToProviderAt          DateTime?

  // === REGISTRO CONTABLE ===
  accountingEntry           ServiceAccountingEntry?

  @@map("service_invoices")
}

enum InvoiceStatus {
  ISSUED
  SENT
  PAID
  DISPUTED
  CANCELLED
}

// Registro contable interno (SOLO admin/accountant)
model ServiceAccountingEntry {
  id                    String          @id @default(cuid())
  invoiceId             String          @unique
  invoice               ServiceInvoice  @relation(fields: [invoiceId], references: [id])
  agreementNumber       String
  providerCode          String
  serviceDate           DateTime
  clientChargedTotal    Decimal         @db.Decimal(10, 2)
  ivaAmount             Decimal         @db.Decimal(10, 2)
  companyCommission     Decimal         @db.Decimal(10, 2)
  providerNetPayment    Decimal         @db.Decimal(10, 2)
  currency              String          @default("USD")
  walletCreditId        String?         // ID de la transacción en el wallet del proveedor
  recordedAt            DateTime        @default(now())

  @@map("service_accounting_entries")
}
```

## 2.7 Sistema de Reseñas Bidireccional

```prisma
// Reseña del CLIENTE sobre el PROVEEDOR (pública, visible para todos)
model ProviderReview {
  id                        String               @id @default(cuid())
  appointmentId             String               @unique
  appointment               Appointment          @relation(fields: [appointmentId], references: [id])
  clientId                  String
  client                    User                 @relation(fields: [clientId], references: [id])
  providerId                String
  provider                  ServiceProvider      @relation(fields: [providerId], references: [id])
  serviceId                 String
  service                   ServiceListing       @relation(fields: [serviceId], references: [id])

  rating                    Int                  // 1-5
  title                     String?
  comment                   String               @db.VarChar(1000)
  isAnonymous               Boolean              @default(false)

  isVisible                 Boolean              @default(true)
  moderationFlag            String?
  moderatedByUserId         String?
  moderatedAt               DateTime?

  createdAt                 DateTime             @default(now())

  @@map("provider_reviews")
}

// Reseña del PROVEEDOR sobre el CLIENTE
// ⚠️ INVISIBLE para el cliente — solo admin y otros proveedores la ven
model ClientReview {
  id                        String               @id @default(cuid())
  appointmentId             String               @unique
  appointment               Appointment          @relation(fields: [appointmentId], references: [id])
  providerId                String
  provider                  ServiceProvider      @relation(fields: [providerId], references: [id])
  clientId                  String
  client                    User                 @relation(fields: [clientId], references: [id])

  rating                    Int                  // 1-5
  behaviorRating            Int                  // Comportamiento
  punctualityRating         Int                  // Puntualidad
  comment                   String               @db.VarChar(500)
  isRecommended             Boolean              @default(true)

  isVisible                 Boolean              @default(true)
  moderatedByUserId         String?

  createdAt                 DateTime             @default(now())

  @@map("client_reviews")
}
```

## 2.8 Sistema de Sanciones y Amonestaciones

```prisma
model ProviderWarning {
  id                        String               @id @default(cuid())
  providerId                String
  provider                  ServiceProvider      @relation(fields: [providerId], references: [id])
  type                      WarningSeverity
  reason                    String
  details                   String?              @db.Text
  issuedByUserId            String
  issuedAt                  DateTime             @default(now())
  expiresAt                 DateTime?
  resolvedAt                DateTime?
  resolutionNotes           String?

  @@map("provider_warnings")
}

model ClientWarning {
  id                        String               @id @default(cuid())
  clientId                  String
  client                    User                 @relation(fields: [clientId], references: [id])
  type                      WarningSeverity
  reason                    String
  details                   String?
  issuedByUserId            String
  issuedAt                  DateTime             @default(now())
  expiresAt                 DateTime?
  resolvedAt                DateTime?
  resolutionNotes           String?

  @@map("client_warnings")
}

enum WarningSeverity {
  INFO              // Llamada de atención
  WARNING           // Amonestación formal
  SUSPENSION_TEMP   // Suspensión temporal
  SUSPENSION_PERM   // Suspensión permanente
}
```

## 2.9 Disponibilidad del Proveedor

```prisma
model ProviderSchedule {
  id                        String               @id @default(cuid())
  providerId                String
  provider                  ServiceProvider      @relation(fields: [providerId], references: [id])
  dayOfWeek                 Int                  // 0=Dom, 1=Lun,..., 6=Sáb
  startTime                 String               // "08:00"
  endTime                   String               // "17:00"
  slotDurationMinutes       Int                  @default(60)
  isActive                  Boolean              @default(true)
  breakStart                String?              // "12:00"
  breakEnd                  String?              // "13:00"

  @@unique([providerId, dayOfWeek])
  @@map("provider_schedules")
}

model ProviderBlockedDate {
  id                        String               @id @default(cuid())
  providerId                String
  provider                  ServiceProvider      @relation(fields: [providerId], references: [id])
  date                      DateTime
  reason                    String?

  @@map("provider_blocked_dates")
}
```

## 2.10 Notificaciones del Sistema

```prisma
model SystemNotification {
  id                        String               @id @default(cuid())
  userId                    String
  user                      User                 @relation(fields: [userId], references: [id])
  type                      NotificationType
  title                     String
  body                      String               @db.Text
  data                      Json?
  channels                  String[]             // ["EMAIL", "WHATSAPP", "PUSH", "TELEGRAM"]

  emailSentAt               DateTime?
  emailError                String?
  whatsappSentAt            DateTime?
  whatsappError             String?
  telegramSentAt            DateTime?
  telegramError             String?
  pushSentAt                DateTime?
  pushError                 String?
  readAt                    DateTime?

  createdAt                 DateTime             @default(now())

  @@index([userId, readAt])
  @@map("system_notifications")
}

enum NotificationType {
  APPOINTMENT_REQUESTED
  APPOINTMENT_RESPONDED
  APPOINTMENT_CONFIRMED
  APPOINTMENT_PAID
  APPOINTMENT_REMINDER_24H
  APPOINTMENT_REMINDER_1H
  APPOINTMENT_QR_SCANNED
  BIPARTITE_PENDING
  BIPARTITE_COMPLETED
  INVOICE_ISSUED
  REVIEW_REQUESTED
  REVIEW_RECEIVED
  WARNING_ISSUED
  SUSPENSION_NOTICE
  KYC_SUBMITTED
  KYC_APPROVED
  KYC_REJECTED
  KYC_REQUIRES_UPDATE
  NEW_SERVICE_PENDING_APPROVAL
  SERVICE_APPROVED
  SERVICE_UPDATE_PENDING
  EMERGENCY_REQUEST
  EMERGENCY_ACCEPTED
  EMERGENCY_DECLINED
}
```

## 2.11 Documentos Legales Dinámicos

```prisma
model LegalDocument {
  id          String   @id @default(cuid())
  slug        String   @unique
  // "terms-of-service" | "provider-regulations" | "client-regulations"
  // "provider-agreement" | "privacy-policy"
  title       String
  content     String   @db.Text  // Markdown
  version     String             // "1.0", "1.1"
  isActive    Boolean  @default(true)
  updatedAt   DateTime @updatedAt
  updatedBy   String?

  @@map("legal_documents")
}

model UserLegalAcceptance {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  documentSlug    String
  documentVersion String
  acceptedAt      DateTime @default(now())
  ipAddress       String?

  @@unique([userId, documentSlug])
  @@map("user_legal_acceptances")
}
```

## 2.12 Cola de Eventos del Sistema

```prisma
model SystemEvent {
  id              String      @id @default(cuid())
  eventType       String
  /*
  booking_created | booking_confirmed | booking_cancelled |
  service_executed | payment_completed | invoice_generated |
  kyc_submitted | kyc_approved | kyc_rejected |
  provider_sanctioned | review_submitted | emergency_requested
  */
  entityType      String      // "appointment" | "invoice" | "provider" | etc.
  entityId        String
  payload         Json
  processedAt     DateTime?
  processingError String?
  retryCount      Int         @default(0)
  createdAt       DateTime    @default(now())

  @@index([eventType, processedAt])
  @@map("system_events")
}
```

---

<a name="parte-3"></a>
# PARTE 3 — API ROUTES COMPLETAS (BACKEND)

> **INSTRUCCIÓN:** Crea todos los archivos dentro de `apps/web/app/api/`. Cada endpoint valida: (1) autenticación, (2) rol autorizado, (3) datos de entrada con Zod, (4) reglas de negocio. Retorna siempre `{ success: boolean, data?: T, error?: string, code?: string }`.

## 3.1 API de Proveedor

### `POST /api/services/provider/register`
- **Rol:** PROVIDER o cualquier usuario autenticado
- **Valida:** userId no tiene ya un ServiceProvider
- **Crea:** ServiceProvider(PENDING_KYC), dispara evento `provider_registration_started`

### `PUT /api/services/provider/kyc`
- **Rol:** PROVIDER dueño del registro
- **KYC completo requiere:** idDocumentUrl, selfieWithIdUrl, al menos 1 professionalTitleUrl, licenseNumber, licenseIssuedBy
- **Al completar:** kycStatus=SUBMITTED, status=PENDING_APPROVAL, notifica a todos los ADMIN/SUPER_ADMIN
- **Dispara evento:** `kyc_submitted`

### `PUT /api/services/provider/profile`
- **Rol:** PROVIDER con status=ACTIVE
- **Puede actualizar:** fotos, contacto, bio, redes sociales
- **No puede actualizar:** campos KYC aprobados (solo Admin)

### `GET /api/services/provider/:providerId`
- **Rol:** Cualquier usuario autenticado
- **Devuelve:** Perfil público. **NUNCA** incluye: internalPrice, documentos KYC, agreementNumber completo

### `GET /api/services/provider/:providerId/admin`
- **Rol:** ADMIN, SUPER_ADMIN, ACCOUNTANT
- **Devuelve:** Perfil completo con KYC, precios internos, convenio

### `POST /api/admin/providers/:providerId/approve`
- **Rol:** ADMIN, SUPER_ADMIN
- **Genera:** agreementNumber = `SC-CONV-{YYYYMM}-{secuencial 6 dígitos}`
- **Notifica:** Al proveedor por todos sus canales
- **Dispara evento:** `provider_approved`

### `POST /api/admin/providers/:providerId/reject`
- **Body:** `{ reason: string }`
- **Dispara evento:** `provider_rejected`

### `POST /api/admin/providers/:providerId/request-update`
- **Body:** `{ fieldsToUpdate: string[], message: string }`
- **Cambia:** kycStatus=REQUIRES_UPDATE, notifica al proveedor

---

## 3.2 API de Servicios

### `POST /api/services/listings`
- **Rol:** PROVIDER con status=ACTIVE
- **Validaciones de precio (SIEMPRE en servidor):**
  ```
  if (memberPrice >= publicPrice) → error: "memberPrice debe ser menor a publicPrice"
  if (internalPrice >= memberPrice) → error: "internalPrice debe ser menor a memberPrice"
  companyCommission = memberPrice - internalPrice  // Calculado por servidor
  commissionPercentage = (companyCommission / memberPrice) * 100
  ```
- **Primer servicio:** requiresApproval=true automáticamente
- **Dispara evento:** `service_listing_created`

### `GET /api/services/listings`
- **Params:** `?category=&city=&search=&modality=&minPrice=&maxPrice=&page=&emergency=`
- **Regla de precio por autenticación:**
  ```
  Sin auth → publicPrice
  Auth sin membresía activa → publicPrice
  Auth con PREFERENTE/PIONERO → memberPrice + badge "Precio Exclusivo SaidonClub"
  NUNCA → internalPrice
  ```

### `GET /api/services/listings/:listingId`
- Mismas reglas de precio que el listado

### `PUT /api/services/listings/:listingId`
- **Rol:** PROVIDER dueño del servicio
- **Guarda en:** `pendingUpdate` (no sobreescribe el activo)
- **Notifica:** Admin de cambio pendiente

### `POST /api/admin/listings/:listingId/approve-update`
- **Rol:** ADMIN
- **Aplica:** `pendingUpdate` → servicio activo, limpia pendingUpdate

### `GET /api/services/provider/:providerId/available-slots`
- **Params:** `?date=YYYY-MM-DD&serviceId=`
- **Calcula:** Slots disponibles según ProviderSchedule, excluyendo ProviderBlockedDates y citas ya confirmadas

---

## 3.3 API de Beneficiarios Familiares

### `POST /api/user/beneficiaries`
- **Rol:** Usuario con membresía PREFERENTE o PIONERO
- **Límite:** Máximo 5 beneficiarios activos. Error claro si ya tiene 5.
- **Valida:** idDocumentNumber único por cuenta

### `GET /api/user/beneficiaries`
- Retorna lista de beneficiarios del usuario autenticado

### `PUT /api/user/beneficiaries/:beneficiaryId`
- Solo puede actualizar el usuario dueño

### `DELETE /api/user/beneficiaries/:beneficiaryId`
- **No borra:** Cambia isActive=false (mantiene historial)

---

## 3.4 API del Sistema de Citas (Booking Engine)

### `POST /api/appointments`
- **Rol:** Usuario autenticado con membresía activa (o cliente externo para precio público)
- **Body:**
  ```json
  {
    "serviceId": "...",
    "beneficiaryId": "..." | null,
    "requestedDate": "2026-05-15",
    "requestedTimeSlot": "10:00-11:00",
    "clientNotes": "...",
    "isEmergency": false
  }
  ```
- **Proceso:**
  1. Validar servicio ACTIVE
  2. Validar membresía activa del cliente
  3. Snapshot de precios vigentes (inmutable)
  4. Si isEmergency=true y allowEmergency=false → error
  5. Crear Appointment(PENDING_PROVIDER)
  6. Notificar al proveedor
  7. Dispara evento `booking_created`

### `POST /api/appointments/:appointmentId/provider-respond` (Negotiation Engine)
- **Rol:** PROVIDER dueño de la cita
- **Body:**
  ```json
  {
    "action": "PROPOSE_SLOTS" | "REJECT",
    "proposedSlots": [
      {"date": "2026-05-15", "time": "09:00"},
      {"date": "2026-05-15", "time": "14:00"},
      {"date": "2026-05-16", "time": "10:00"}
    ],
    "providerNotes": "...",
    "rejectionReason": "..."
  }
  ```
- **Si PROPOSE_SLOTS:** status=PROVIDER_RESPONDED, notifica cliente
- **Si REJECT:** status=CANCELLED_PROVIDER, notifica cliente, registra en historial

### `POST /api/appointments/:appointmentId/client-confirm`
- **Rol:** Cliente dueño de la cita
- **Body:** `{ "selectedSlot": {"date": "...", "time": "..."} }`
- **Sin prepago:** status=CONFIRMED, notifica proveedor
- **Con prepago:** status=PENDING_PAYMENT, retorna URL de pago

### `POST /api/appointments/:appointmentId/pay`
- **Rol:** Cliente (solo si status=PENDING_PAYMENT)
- **Body:** `{ "paymentMethod": "...", "paymentDetails": {...} }`
- **Proceso ACID:**
  ```
  1. Procesar pago por método elegido
  2. Si exitoso:
     a. status=PAID
     b. Fondos quedan en "retenidos" (no liberados al proveedor aún)
     c. Generar recibo de prepago (PDF)
     d. Enviar recibo por email + WhatsApp + Telegram
     e. Notificar al proveedor
     f. Disparar evento payment_completed
  ```
- **AVISO OBLIGATORIO EN RECIBO:**
  > "⚠️ El pago de este servicio es definitivo. No se aceptan cancelaciones ni devoluciones una vez confirmado el pago. Eres responsable de presentarte puntualmente a tu cita."

### `POST /api/appointments/:appointmentId/cancel`
- **Cancelación permitida solo si:**
  - Cliente: status=PENDING_PROVIDER o PROVIDER_RESPONDED
  - Proveedor: cualquier status previo a COMPLETED (pero queda en historial)
- **Si status=CONFIRMED o PAID:** El cliente NO puede cancelar. Debe ir a soporte.

### `POST /api/appointments/:appointmentId/qr-scan`
- **Rol:** PROVIDER dueño de la cita
- **Body:** `{ "qrToken": "...", "appointmentId": "...", "attendeeType": "HOLDER" | "BENEFICIARY", "beneficiaryId": "..." | null }`
- **Proceso:**
  1. Decodificar JWT del QR
  2. Verificar membresía no expirada
  3. Verificar que la cita corresponde al usuario escaneado
  4. Mostrar al proveedor: foto + datos + membresía + beneficiarios disponibles
  5. status=IN_PROGRESS, registrar actualStartTime
  6. Notificar al cliente
  7. Disparar evento `qr_scanned`

### `POST /api/appointments/:appointmentId/bipartite`
- **Fase 1 (Proveedor llena):**
  - Rol: PROVIDER
  - Crea BipartiteForm(PROVIDER_FILLING → PENDING_CLIENT_ACCEPTANCE)
  - Notifica cliente: "Confirma tu servicio recibido"
- **Fase 2 (Cliente responde):**
  - Rol: Cliente dueño
  - Body: `{ "action": "ACCEPT" | "REJECT", "rejectionReason": "..." }`
  - **Si ACCEPT:** Transacción ACID:
    ```
    1. formStatus=BOTH_SIGNED
    2. appointment.status=COMPLETED
    3. Generar ServiceInvoice (número secuencial)
    4. Generar PDF de factura
    5. Acreditar wallet proveedor (providerNetAmount)
    6. Registrar comisión empresa (serviceAccountingEntry)
    7. Notificar a ambas partes
    8. Disparar eventos: service_executed, invoice_generated
    9. Programar review requests (72h después)
    ```
  - **Si REJECT:** formStatus=DISPUTED, notifica Admin, proveedor cobra publicPrice directamente

---

## 3.5 API de QR del Usuario

### `GET /api/user/qr-token`
- **Rol:** Usuario autenticado
- **Genera JWT con:**
  ```json
  {
    "userId": "...",
    "memberType": "PREFERENTE" | "PIONERO",
    "membershipExpiresAt": "...",
    "isActive": true,
    "iat": "...",
    "exp": "...(now + 24h)"
  }
  ```
- **Devuelve:** String para generar QR visual en frontend

### `POST /api/services/provider/scan-qr`
- **Rol:** PROVIDER ACTIVE
- **Body:** `{ "qrToken": "...", "appointmentId": "..." }`
- **Proceso:**
  1. Verificar y decodificar JWT
  2. Verificar membresía no expirada
  3. Buscar cita activa para hoy
  4. Devolver: datos titular + beneficiarios + foto + estado membresía

---

## 3.6 API de Facturación

### `POST /api/invoices/service` (INTERNA — solo llamada por el sistema)
- **Se dispara:** Cuando BipartiteForm=BOTH_SIGNED
- **Proceso:**
  1. Calcular: subtotal, IVA, total, comisión, neto proveedor
  2. Generar número secuencial: `SC-SRV-{YYYYMM}-{000001}`
  3. Generar PDF (`@react-pdf/renderer`)
  4. Subir PDF a Supabase Storage
  5. Guardar URL en ServiceInvoice
  6. Enviar PDF por email a cliente y proveedor
  7. Crear ServiceAccountingEntry
  8. Si fue prepago: marcar fondos retenidos como liberados

### `GET /api/invoices/:invoiceId`
- **Cliente/Proveedor:** subtotal, IVA, total (sin datos internos)
- **ADMIN/ACCOUNTANT:** todo incluyendo comisión y neto proveedor

---

## 3.7 API de Reseñas

### `POST /api/reviews/provider`
- **Rol:** Cliente (72h ventana post-COMPLETED)
- **Valida:** rating 1-5, comment mínimo 20 chars
- **Actualiza:** promedio del proveedor

### `POST /api/reviews/client`
- **Rol:** Proveedor (72h post-COMPLETED)
- **REGLA:** Las ClientReview NUNCA aparecen en el dashboard del cliente

### `GET /api/reviews/provider/:providerId`
- Promedio, distribución, comentarios visibles paginados

---

## 3.8 API de Moderación

### `POST /api/admin/warnings/provider`
- **Body:** `{ providerId, type, reason, details, expiresAt? }`
- **Si SUSPENSION_TEMP:** actualiza provider.status=SUSPENDED_TEMP
- **Si SUSPENSION_PERM:** actualiza provider.status=SUSPENDED_PERM

### `POST /api/admin/warnings/client`
- **Body:** `{ clientId, type, reason, details, expiresAt? }`
- **Si SUSPENSION_PERM:** bloquea al usuario del sistema

---

<a name="parte-4"></a>
# PARTE 4 — FLUJOS DE NEGOCIO DETALLADOS

## FLUJO A — Onboarding del Proveedor (KYC Completo)

```
PASO 1: Usuario accede a /dashboard/provider/onboarding
        Stepper: [Básico] → [KYC] → [Servicios] → [Revisión]

PASO 2: INFORMACIÓN BÁSICA
  businessName, profession, professionCategory
  phone, email, whatsapp, address, city
  bio
  → status = PENDING_KYC

PASO 3: KYC PROFESIONAL (por categoría)

  SI professionCategory = HEALTH:
    → Número SENESCYT, universidad, año de graduación
    → Documentos: título profesional, certificado SENESCYT, ACESS (si aplica)

  SI professionCategory = LEGAL:
    → Número Foro de Abogados
    → Documentos: título, certificado del Foro

  SI professionCategory = ARCHITECTURE / ENGINEERING:
    → Número CIAP
    → Documentos: título, registro colegial vigente

  PARA TODOS:
    → Cédula frente y reverso
    → Selfie sosteniendo la cédula
    → Hasta 3 fotos personales
    → Hasta 3 fotos de trabajo
    → Hasta 3 fotos del local/negocio

  Al enviar → kycStatus = SUBMITTED, status = PENDING_APPROVAL
  Sistema notifica a todos los ADMIN por email + push

PASO 4: REVISIÓN ADMIN (/admin/servicios/kyc/:providerId)
  El admin puede:
  a) APROBAR → status=ACTIVE, genera agreementNumber único
  b) RECHAZAR → status=REJECTED con razón
  c) SOLICITAR CORRECCIONES → kycStatus=REQUIRES_UPDATE, notifica al proveedor

PASO 5: NOTIFICACIÓN AL PROVEEDOR
  Si aprobado:
    "¡Felicidades! Tu perfil ha sido aprobado.
     Tu número de convenio es [SC-CONV-XXXXXX]. Ya puedes agregar tus servicios."

  Si rechazado:
    "Tu solicitud fue rechazada por: [razón].
     Puedes volver a aplicar corrigiendo los datos indicados."

PASO 6: PUBLICAR SERVICIOS (solo si ACTIVE)
  Proveedor crea servicios con 3 niveles de precio
  El servidor calcula companyCommission y commissionPercentage
  Primeros servicios: requiresApproval=true hasta aprobación admin
```

---

## FLUJO B — Registro de Beneficiarios Familiares

```
PASO 1: Usuario con membresía → /dashboard/familia
        Sistema muestra beneficiarios actuales (X/5)

PASO 2: Formulario nuevo beneficiario:
  firstName, lastName, relationship, dateOfBirth
  idDocumentNumber, idDocumentType
  Foto del familiar + imagen de cédula

PASO 3: Validaciones:
  → Máximo 5 beneficiarios activos
  → idDocumentNumber único en la cuenta

PASO 4: El QR del titular cubre a TODOS sus beneficiarios activos.
  Al escanear: proveedor ve titular + lista de beneficiarios.
  Proveedor selecciona: "¿La atención es para...?"
```

---

## FLUJO C — Solicitud de Servicio (Sin Prepago)

```
PASO 1: Cliente navega /servicios
  Ve precios según su estado de membresía
  Filtra por categoría, ciudad, modalidad, precio, calificación

PASO 2: Tarjeta de servicio muestra:
  → Precio público (siempre visible)
  → Precio miembro (solo si membresía activa) con badge "Precio Exclusivo"
  → Duración, modalidad, calificación
  → Badge "Acepta emergencias" si aplica

PASO 3: Solicitar servicio → modal/página de solicitud
  → Si no autenticado: redirige a login con retorno

PASO 4: Formulario de solicitud:
  → ¿Para quién? (titular o beneficiario familiar)
  → Fecha preferida (date picker con días disponibles del proveedor)
  → Franja horaria (según schedule del proveedor)
  → Notas adicionales (opcional, 500 chars)
  → Checkbox: "Acepto los términos del servicio de SaidonClub"

PASO 5: Sistema crea Appointment(PENDING_PROVIDER)
  → Snapshot de precios guardados
  → Notifica proveedor: email + WhatsApp + push

PASO 6: Proveedor responde desde /dashboard/provider/citas
  a) PROPONER HORARIOS: selecciona 2-3 slots
     → status = PROVIDER_RESPONDED
     → Notifica cliente con slots propuestos
  b) RECHAZAR (con razón)
     → status = CANCELLED_PROVIDER
     → Notifica cliente

PASO 7: Cliente elige horario → status = CONFIRMED
  → Ambos reciben resumen completo por email + WhatsApp

PASO 8: Recordatorios automáticos:
  → 24h antes: cliente y proveedor
  → 1h antes: cliente y proveedor

PASO 9: El día de la cita — Proveedor escanea QR del cliente
  → Sistema muestra: foto titular + beneficiario si aplica
  → status = IN_PROGRESS, registra actualStartTime

PASO 10: Al finalizar — Formulario Bipartito (proveedor llena)
  → Descripción del servicio
  → Extras (si hubo)
  → Monto total (sistema calcula con IVA)
  → Forma de pago
  → Envía al cliente para aceptación

PASO 11: Cliente acepta desde su app
  → formStatus = BOTH_SIGNED
  → status = COMPLETED
  → Factura generada automáticamente
  → Wallet del proveedor acreditado
  → Comisión registrada

PASO 12: 72h después → Invitaciones a dejar reseña
```

---

## FLUJO D — Solicitud de Servicio (Con Prepago)

```
Igual que Flujo C hasta PASO 6, luego:

PASO 7b: En lugar de confirmar, sistema muestra:
  ┌──────────────────────────────────────────┐
  │ Consulta Médica General                  │
  │ Dr. Juan Pérez                           │
  │ Miércoles 20 de mayo, 10:00 AM          │
  │ ──────────────────────────────────────── │
  │ Precio exclusivo SaidonClub:   $40.00    │
  │ IVA (15%):                      $6.00    │
  │ TOTAL A PAGAR:                 $46.00    │
  └──────────────────────────────────────────┘

  ⚠️ AVISO OBLIGATORIO (mostrar en negrita):
  "Una vez realizado el pago, la cita queda confirmada definitivamente.
   No se aceptan cancelaciones ni devoluciones bajo ninguna circunstancia.
   Si no te presentas, pierdes el monto pagado.
   Para emergencias, contacta a soporte inmediatamente."

  → Checkbox: "Entiendo y acepto que el pago es definitivo"
  → 9 métodos de pago disponibles
  → Botón "Confirmar y Pagar $46.00"

PASO 7c: Pago procesado exitosamente:
  1. status = PAID
  2. Fondos en "retenidos" (no al proveedor hasta COMPLETED)
  3. Genera recibo de prepago (PDF)
     Incluye: SC-APT-{número}, datos, fecha, monto, QR de reserva, condiciones
  4. Envía recibo: email + WhatsApp + Telegram
  5. Notifica al proveedor: "Pago confirmado para su cita del [fecha]"
  6. Dispara evento: payment_completed

Continúa igual que Flujo C desde PASO 8.
Al llegar a COMPLETED → fondos retenidos se liberan al proveedor.
```

---

## FLUJO E — Solicitud de Emergencia

```
PASO 1: Cliente hace clic en "¡Emergencia!" (visible solo si allowEmergency=true)

PASO 2: Modal de confirmación:
  "¿Confirmas que esto es una emergencia que no puede esperar?"
  Campo obligatorio: "Describe brevemente la emergencia"

PASO 3: Sistema crea Appointment:
  isEmergency=true, status=EMERGENCY, sin fecha específica

PASO 4: Notificación URGENTE al proveedor:
  🚨 Push (sonido de emergencia) + WhatsApp + SMS + Email
  "EMERGENCIA: Cliente [Nombre] necesita atención urgente.
   Motivo: [descripción]. Tel: [teléfono]"

PASO 5: Proveedor responde:
  Si ACEPTA: coordina directamente con el cliente
  Si NO PUEDE: sistema busca otro proveedor del mismo tipo y categoría

PASO 6: Post-atención (hasta 24h después)
  → Proveedor registra el servicio (formulario bipartito)
  → Cliente confirma desde su app
  → Las emergencias NO requieren prepago (siempre postpago)
```

---

<a name="parte-5"></a>
# PARTE 5 — LÓGICA FINANCIERA INTERNA (ACID)

> **INSTRUCCIÓN:** Esta lógica NUNCA se expone al frontend público. Solo Admin, Super Admin y Accountant pueden ver los datos internos. Todos los cálculos se ejecutan en servidor.

## 5.1 Ejemplo Completo de Cálculo

```
Configuración del servicio (Doctor Oculista):
  publicPrice     = $50.00
  memberPrice     = $40.00
  internalPrice   = $30.00  ← NUNCA al frontend
  ivaPercentage   = 15%
  ivaIncluded     = false

Cuando un miembro SaidonClub usa el servicio:
  baseCharge      = memberPrice = $40.00
  ivaAmount       = $40.00 × 0.15 = $6.00
  totalCharged    = $46.00  ← Lo paga el cliente

Distribución interna (ACID, un solo bloque de transacción):
  companyCommission  = memberPrice - internalPrice = $40 - $30 = $10.00
  providerNetAmount  = internalPrice = $30.00
  ivaToReport        = $6.00 (obligación tributaria del proveedor)

  Wallet del proveedor recibe: $30.00
  Empresa retiene: $10.00 de comisión + gestiona IVA ($6.00)

Registro en ServiceAccountingEntry:
  {
    agreementNumber: "SC-CONV-202605-000001",
    providerCode: "SC-PROV-...",
    serviceDate: "2026-05-20",
    clientChargedTotal: 46.00,
    ivaAmount: 6.00,
    companyCommission: 10.00,
    providerNetPayment: 30.00,
    currency: "USD"
  }
```

## 5.2 Regla del Precio Público

```
Cliente SIN membresía activa → aplica publicPrice
Cliente rechaza formulario bipartito → aplica publicPrice
  (Proveedor cobra directamente, sistema registra sin comisión)

El sistema NUNCA cobra menos que publicPrice sin membresía válida.
```

## 5.3 Wallet del Proveedor (Transacción ACID)

```typescript
// TRANSACTION ATÓMICA — Todo o nada
await prisma.$transaction(async (tx) => {
  // 1. Actualizar cita
  await tx.appointment.update({
    where: { id: appointmentId },
    data: { status: 'COMPLETED', actualEndTime: new Date() }
  });

  // 2. Acreditar wallet del proveedor
  await tx.walletTransaction.create({
    data: {
      walletId: provider.walletId,
      type: 'SERVICE_PAYMENT',
      amount: providerNetAmount,
      status: isPrepaid ? 'RELEASED' : 'AVAILABLE',
      reference: `SC-SRV-${invoiceNumber}`
    }
  });

  // 3. Registrar comisión de empresa
  await tx.serviceAccountingEntry.create({
    data: { ...accountingData }
  });

  // 4. Actualizar factura
  await tx.serviceInvoice.update({
    where: { appointmentId },
    data: { invoiceStatus: 'PAID', pdfUrl }
  });

  // 5. Disparar evento para MLM Engine
  await tx.systemEvent.create({
    data: {
      eventType: 'service_executed',
      entityType: 'appointment',
      entityId: appointmentId,
      payload: { providerId, clientId, amount: totalCharged }
    }
  });
});
```

---

<a name="parte-6"></a>
# PARTE 6 — EVENT-DRIVEN SYSTEM

> **INSTRUCCIÓN:** Implementa un procesador de eventos en background. Cada evento generado en la tabla `SystemEvent` debe ser procesado por el handler correspondiente.

## 6.1 Mapa de Eventos y Handlers

| Evento | Handler | Efecto |
|--------|---------|--------|
| `booking_created` | NotificationHandler | Notifica proveedor |
| `booking_confirmed` | NotificationHandler + MLMHandler | Notifica ambas partes, actualiza métricas |
| `payment_completed` | InvoiceHandler + NotificationHandler | Genera recibo, notifica |
| `qr_scanned` | NotificationHandler | Notifica cliente de inicio |
| `service_executed` | BillingHandler + WalletHandler + MLMHandler | Factura, acredita wallet, MLM |
| `invoice_generated` | NotificationHandler | Envía PDF a ambas partes |
| `kyc_submitted` | NotificationHandler | Notifica admins |
| `kyc_approved` | NotificationHandler | Notifica proveedor, genera convenio |
| `provider_sanctioned` | StatusHandler + NotificationHandler | Actualiza estado, notifica |
| `emergency_requested` | EmergencyHandler | Notificación urgente al proveedor |

## 6.2 Procesador de Eventos

```typescript
// packages/event-processor/src/index.ts
class EventProcessor {
  async processEvent(event: SystemEvent): Promise<void> {
    try {
      switch (event.eventType) {
        case 'booking_created':
          await this.handleBookingCreated(event);
          break;
        case 'service_executed':
          await this.handleServiceExecuted(event);
          break;
        // ... otros handlers
      }
      await markEventProcessed(event.id);
    } catch (error) {
      await markEventFailed(event.id, error.message);
      // Reintentar con backoff exponencial (máx 3 intentos)
    }
  }
}
```

---

<a name="parte-7"></a>
# PARTE 7 — FRONTEND / PÁGINAS Y COMPONENTES

> **INSTRUCCIÓN:** Crea estas páginas en `apps/web/app/`. Sigue el estándar visual "Obsidian & Orange": fondos oscuros, degradados suaves, glassmorphism, tipografía fluida con `clamp()`, acentos en naranja.

## 7.1 Marketplace de Servicios

### `/servicios` — Marketplace principal
```
LAYOUT:
  - Hero con buscador prominent (fondo oscuro, gradiente)
  - Filtros horizontales: categoría (chips), ciudad, modalidad, precio (slider), emergencias
  - Grid responsive de tarjetas (3 cols desktop, 2 tablet, 1 móvil)
  - Mapa lateral opcional (Google Maps embed con pins de proveedores)
  - Paginación con infinite scroll opcional

TARJETA DE SERVICIO:
  - Foto del proveedor (circular, 80px, borde naranja si "Acepta emergencias")
  - Badge de categoría (chip coloreado por tipo)
  - Nombre del servicio (bold)
  - Nombre del proveedor (secundario)
  - Calificación (estrellas doradas + número de reseñas)
  - Ciudad + badge de modalidad (PRESENCIAL/VIRTUAL/DOMICILIO)
  - Precio público siempre visible
  - Precio miembro solo si membresía activa (badge verde "Precio Exclusivo SaidonClub")
  - Duración estimada
  - Badge "⚡ Acepta Emergencias" si allowEmergency=true
  - Botones: "Ver detalles" + "Solicitar" (acción rápida)
```

### `/servicios/[serviceId]` — Detalle del servicio
```
SECCIONES:
  1. Header: foto + nombre + profesión + calificación + badges verificado
  2. Galería: fotos proveedor, negocio, trabajo (carousel)
  3. Descripción del servicio (markdown renderizado)
  4. Tabla de precios:
     - Para público: columna "Precio regular" + "Precio SaidonClub"
     - Para Admin/Accountant: columna adicional "Precio interno" (oculta a todos los demás)
  5. Información: dirección, mapa, horarios de atención
  6. Formulario de solicitud de cita (o botón que abre modal)
  7. Reseñas de clientes (paginadas, con filtro por calificación)
  8. Otros servicios del mismo proveedor
```

### `/proveedores/[providerId]` — Perfil público del proveedor
```
SECCIONES:
  1. Encabezado: foto grande + nombre + profesión + calificación global
     Badge "Proveedor Verificado SaidonClub" (NO mostrar el número de convenio)
  2. Galería completa de fotos (masonry grid)
  3. Bio y credenciales ("Verificado por SaidonClub" — sin mostrar documentos)
  4. Contacto y redes sociales
  5. Lista de servicios activos
  6. Reseñas
```

---

## 7.2 Dashboard del Proveedor

### `/dashboard/provider` — Panel principal
```
BLOQUES:
  - Resumen financiero: ingresos del mes, pendientes de cobro
  - Citas de hoy (resaltadas)
  - Solicitudes pendientes de respuesta (alerta si > 0)
  - Calificación promedio + número de reseñas
  - Estado del perfil: si KYC pendiente → alerta con pasos a seguir
  - Notificaciones recientes
```

### `/dashboard/provider/citas` — Gestión de citas
```
TABS:
  - 🔴 Pendientes (PENDING_PROVIDER): alerta si llevan > 2h sin respuesta
  - 📅 Confirmadas: próximas citas ordenadas por fecha
  - ⚡ En Curso (IN_PROGRESS)
  - ✅ Completadas
  - ❌ Canceladas/Rechazadas
  - 🚨 Emergencias

ACCIONES POR CITA:
  Pendiente → [Proponer Horarios] [Rechazar]
  Confirmada → [Ver Detalles] [Iniciar Atención → activa escáner QR]
  En Curso → [Llenar Formulario de Servicio]
```

### `/dashboard/provider/scanner` — Escáner QR
```
INTERFAZ:
  - Cámara activa para escanear
  - Al escanear:
    * Foto grande del titular
    * Nombre + tipo de membresía + estado (activo/vencido)
    * Lista de beneficiarios activos con foto y nombre
  - Selector: "¿La atención es para...?"
    [ El titular ] [ Familiar 1 ] [ Familiar 2 ] ...
  - Botón "Confirmar inicio de atención"
```

### `/dashboard/provider/servicios` — Mis servicios
```
- Lista de servicios con estado: ACTIVO / INACTIVO / PENDIENTE APROBACIÓN
- Botón "Agregar nuevo servicio"
- Para cada servicio: editar (guarda como pendingUpdate, requiere aprobación admin)
- Estadísticas por servicio: citas del mes, calificación promedio
```

### `/dashboard/provider/perfil` — Mi perfil y KYC
```
- Stepper visual de KYC con estado actual y porcentaje de completitud
- Formulario actualización: fotos, contacto, bio, redes sociales
- Sección documentos: estado de cada documento subido
- Estado del convenio y número
```

---

## 7.3 Dashboard del Cliente (Nuevos Módulos)

### `/dashboard/familia` — Mis beneficiarios
```
- Header: "Mis beneficiarios (X/5)"
- Lista de beneficiarios: foto + nombre + relación + estado + historial de citas
- Botón "Agregar familiar" (deshabilitado con tooltip si ya tiene 5)
- Modal de nuevo beneficiario con subida de fotos
```

### `/dashboard/mi-qr` — Mi código QR
```
- QR grande y visible (regenerado cada 24h)
- Nombre del titular + foto
- Tipo de membresía + estado (ACTIVO / VENCIDO)
- Botón "Descargar QR como imagen"
- Instrucciones claras: "Muestra este QR al proveedor al inicio de tu cita"
- Si membresía vencida: botón "Renovar membresía" (destacado en naranja)
```

### `/dashboard/citas` — Mis citas
```
TABS: Próximas / Pasadas / Canceladas

Por cada cita próxima según estado:
  PENDING_PROVIDER  → "Esperando respuesta del proveedor" + [Cancelar solicitud]
  PROVIDER_RESPONDED→ Slots propuestos con botones para elegir cada uno
  CONFIRMED         → Resumen + recordatorio + [Preparativos para la cita]
  PENDING_PAYMENT   → [Ir a pagar] con resumen de montos
  PAID              → Confirmación de pago + instrucciones del día
  IN_PROGRESS       → "Tu cita está en curso 🟢"
  BIPARTITE PENDING → ⚠️ Alerta: "Confirma tu servicio recibido" + [Confirmar] [Disputar]
```

---

## 7.4 Panel de Administración

### `/admin/servicios/proveedores` — Gestión de proveedores
```
- Tabla filtrable: por estado, categoría, ciudad, fecha de solicitud
- Para cada proveedor: foto, nombre, profesión, estado, acciones
- Acceso rápido a revisión de KYC
- Métricas: total activos, en revisión, suspendidos
```

### `/admin/servicios/kyc/[providerId]` — Revisión de KYC
```
- Vista completa de todos los documentos subidos (visor de imagen)
- Verificación campo por campo con checkboxes
- Datos del KYC por categoría profesional
- Campo de notas del revisor
- Botones: [Aprobar] [Rechazar] [Solicitar Correcciones]
- Historial de revisiones anteriores
```

### `/admin/servicios/citas` — Vista global de citas
```
- Tabla con todas las citas del sistema
- Filtros: estado, proveedor, cliente, fecha, emergencias, disputas
- Métricas en tiempo real: citas/día, tasa de completado, tasa de cancelación
```

### `/admin/contabilidad/servicios` — Contabilidad interna
```
⚠️ Solo visible para ADMIN, SUPER_ADMIN, ACCOUNTANT

- Tabla de facturas con columnas:
  Fecha | Proveedor | Cliente | Subtotal | IVA | Total | Comisión | Neto Proveedor
- Filtros por proveedor, fecha, estado
- Exportar a CSV/Excel
- Totales acumulados del período
- Gráficos de ingresos y comisiones
```

### `/admin/moderacion` — Sistema de moderación
```
- Reseñas reportadas (flag para revisión)
- Citas en disputa
- Historial de amonestaciones y suspensiones
- Formulario para emitir nueva sanción
```

---

<a name="parte-8"></a>
# PARTE 8 — SISTEMA DE NOTIFICACIONES MULTI-CANAL

> **INSTRUCCIÓN:** Implementa en `packages/notifications/`. Si un canal falla, registra el error pero continúa con los demás. NUNCA bloquear el flujo principal por error de notificación.

## 8.1 Interfaz del Servicio

```typescript
// packages/notifications/src/index.ts

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  urgency?: 'normal' | 'high' | 'emergency';
  channels?: NotificationChannel[];  // Si null, usa preferencias del usuario
}

type NotificationChannel = 'EMAIL' | 'WHATSAPP' | 'TELEGRAM' | 'PUSH';

class NotificationService {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const userPrefs = await getUserNotificationPreferences(payload.userId);
    const channels = payload.channels || userPrefs.channels;
    const results: ChannelResult[] = [];

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'EMAIL':
            await this.sendEmail(payload, userPrefs.email);
            break;
          case 'WHATSAPP':
            await this.sendWhatsApp(payload, userPrefs.whatsapp);
            break;
          case 'TELEGRAM':
            await this.sendTelegram(payload, userPrefs.telegramChatId);
            break;
          case 'PUSH':
            await this.sendPushNotification(payload, userPrefs.fcmToken);
            break;
        }
        results.push({ channel, success: true });
      } catch (error) {
        results.push({ channel, success: false, error: error.message });
        // Registrar error pero CONTINUAR con otros canales
      }
    }

    // Guardar en SystemNotification
    await saveNotificationRecord(payload, results);
    return { results };
  }
}
```

## 8.2 Templates de Mensajes

### Para el Proveedor — Nueva solicitud de cita
```
Asunto: "Nueva solicitud de cita — [Nombre del cliente]"

Hola [Nombre del proveedor],

Tienes una nueva solicitud de cita:

📋 Servicio: [Nombre del servicio]
👤 Cliente: [Nombre] ([tipo de membresía])
📅 Fecha preferida: [Fecha]
⏰ Horario preferido: [Horario]
📝 Notas: [Notas del cliente]
👨‍👩‍👧 ¿Para quién?: [Titular / Familiar: Nombre]

Por favor responde en las próximas 2 horas.
Accede a tu panel: [link]
```

### Para el Cliente — Cita confirmada
```
Asunto: "✅ Cita confirmada — [Nombre del servicio]"

¡Tu cita ha sido confirmada!

📅 Fecha: [Fecha]
⏰ Hora: [Hora]
🏥 Proveedor: [Nombre] ([profesión])
📍 Lugar: [Dirección o "Videollamada"]
💰 Precio: $[monto] (precio exclusivo SaidonClub)

Recuerda:
• Lleva tu código QR (disponible en tu dashboard)
• Preséntate 5 minutos antes
• Para emergencias: [número de soporte]

Ver mi QR: [link]
```

### Para el Cliente — Formulario bipartito pendiente
```
Asunto: "Confirma tu servicio recibido — Acción requerida"

Tu proveedor [Nombre] ha registrado el servicio brindado.

Por favor revisa y confirma que recibiste el servicio:

📋 Servicio: [Descripción]
💰 Monto: $[Total] (IVA incluido)
💳 Forma de pago: [Método]

Tienes 24 horas para confirmar o disputar.

[Confirmar recepción] → [link]
[Tengo un problema] → [link soporte]
```

### Para el Proveedor — Emergencia
```
🚨 EMERGENCIA — Atención urgente requerida

Un cliente necesita atención urgente inmediata.

👤 Cliente: [Nombre]
📞 Teléfono: [número]
🚨 Motivo: [descripción]

Por favor responde lo antes posible:
[Acepto la emergencia] → [link]
[No puedo atender ahora] → [link]
```

---

<a name="parte-9"></a>
# PARTE 9 — DOCUMENTOS LEGALES DINÁMICOS

> **INSTRUCCIÓN:** Crear CRUD de admin en `/admin/legal`. El Super Admin puede actualizar el contenido sin desplegar código. Mostrar siempre la versión activa y la fecha de última modificación.

## 9.1 Documentos Requeridos

### DOCUMENTO 1: Términos y Condiciones Generales
**Slug:** `terms-of-service`
**Contenido incluye:**
- Descripción de SaidonClub como plataforma intermediaria
- Definición de membresías y beneficios (PREFERENTE y PIONERO)
- Descripción del marketplace de servicios profesionales
- Política de cancelaciones (ninguna en servicios prepagados)
- Responsabilidad limitada de SaidonClub como intermediario
- Jurisdicción: República del Ecuador

### DOCUMENTO 2: Reglamento de Proveedores de Servicios
**Slug:** `provider-regulations`
**Contenido incluye:**
- Requisitos para ser proveedor verificado
- Proceso KYC: documentos requeridos por categoría profesional
- Obligaciones del proveedor:
  - Mantener datos actualizados en la plataforma
  - Emitir factura por cada servicio prestado
  - Cumplir con los precios declarados en el convenio
  - Atender al cliente con membresía al precio de convenio (memberPrice)
  - Registrar el servicio en la plataforma dentro de las 24 horas
- Sistema de calificaciones y consecuencias
- Sistema de amonestaciones: INFO → WARNING → SUSPENSION_TEMP → SUSPENSION_PERM
- Causales de suspensión permanente

### DOCUMENTO 3: Reglamento de Clientes
**Slug:** `client-regulations`
**Contenido incluye:**
- Derechos del cliente con membresía activa
- Límites del sistema de beneficiarios (máximo 5 por cuenta)
- Obligaciones del cliente:
  - Presentarse puntualmente a las citas
  - Comportarse de manera respetuosa con los proveedores
  - No solicitar servicios con intención de no utilizarlos
- Sistema de reseñas internas de proveedores sobre clientes
- Consecuencias de mal comportamiento
- Política de no reembolso en servicios prepagados

### DOCUMENTO 4: Convenio Marco de Proveedor
**Slug:** `provider-agreement`
**Se genera dinámicamente al momento de aprobación con:**
- Número de convenio único (SC-CONV-YYYYMM-NNNNNN)
- Datos completos del proveedor
- Tabla de servicios registrados con precios internos y comisiones pactadas
- Obligaciones y derechos del convenio
- Vigencia del convenio
- Firma digital de aceptación del proveedor

### DOCUMENTO 5: Aviso de Privacidad
**Slug:** `privacy-policy`
**Contenido incluye:**
- Datos que se recopilan (personales, profesionales, de uso)
- Uso de los datos (operación de la plataforma, KYC, facturación)
- Compartición con terceros (solo proveedores autorizados de la plataforma)
- Derechos del usuario: acceso, rectificación, cancelación, portabilidad
- Cumplimiento con legislación ecuatoriana de protección de datos

---

<a name="parte-10"></a>
# PARTE 10 — PRUEBAS AUTOMATIZADAS REQUERIDAS

> **INSTRUCCIÓN:** Usa Jest o Vitest. Las pruebas deben correr con `npm test` desde la raíz del monorepo. NUNCA hacer commit sin que pasen todas las pruebas.

## 10.1 Pruebas de Modelo de Datos

```
test: "ServiceListing rechaza si memberPrice >= publicPrice"
test: "ServiceListing rechaza si internalPrice >= memberPrice"
test: "companyCommission se calcula correctamente: memberPrice - internalPrice"
test: "commissionPercentage se calcula: (commission / memberPrice) * 100"
test: "Un usuario no puede tener más de 5 FamilyBeneficiary activos"
test: "FamilyBeneficiary rechaza idDocumentNumber duplicado en la misma cuenta"
test: "Usuario sin membresía activa NO puede ver memberPrice en el marketplace"
test: "internalPrice NUNCA aparece en la respuesta de GET /api/services/listings"
test: "internalPrice NUNCA aparece en la respuesta de GET /api/services/listings/:id"
```

## 10.2 Pruebas del Flujo de Citas (State Machine)

```
test: "Cita PENDING_PROVIDER → PROVIDER_RESPONDED al responder con slots"
test: "Cita PROVIDER_RESPONDED → CONFIRMED al elegir horario (sin prepago)"
test: "Cita PROVIDER_RESPONDED → PENDING_PAYMENT al elegir horario (con prepago)"
test: "Cita PENDING_PAYMENT → PAID al procesar pago exitoso"
test: "Los precios se guardan como snapshot y NO cambian si el proveedor actualiza precios"
test: "Una cita en status PAID no puede ser cancelada por el cliente"
test: "Una cita en status CONFIRMED (sin prepago) puede ser cancelada por el cliente"
test: "Al completar BipartiteForm(BOTH_SIGNED), se genera ServiceInvoice automáticamente"
test: "Al completar BipartiteForm, el providerNetAmount se acredita al wallet del proveedor"
test: "Si el cliente rechaza el bipartito, se aplica publicPrice y NO se genera comisión"
test: "El QR token expira después de 24 horas"
test: "El proveedor solo puede escanear QR de clientes con cita confirmada con él ese día"
test: "Al completar cita con prepago, los fondos retenidos se liberan al proveedor"
```

## 10.3 Pruebas de Seguridad

```
test: "El internalPrice NUNCA aparece en la respuesta de API pública de listado"
test: "El internalPrice NUNCA aparece en la respuesta de API para el cliente"
test: "Las ClientReview NO aparecen en el dashboard del cliente"
test: "Un proveedor no puede ver las citas de otro proveedor"
test: "Un cliente no puede ver las citas de otro cliente"
test: "El formulario bipartito solo puede ser aceptado por el cliente de esa cita"
test: "Un PROVIDER no puede aprobar otro KYC (solo ADMIN/SUPER_ADMIN)"
test: "Un CLIENT no puede crear servicios (solo PROVIDER activo)"
test: "La tabla ServiceAccountingEntry solo responde a ADMIN/ACCOUNTANT"
```

## 10.4 Pruebas de Cálculos Financieros

```
test: "IVA se calcula correctamente al 15% sobre memberPrice"
test: "Si ivaIncluded=true, el IVA se extrae del precio, no se suma"
test: "providerNetAmount = internalPrice (sin IVA)"
test: "companyCommission = memberPrice - internalPrice"
test: "La factura generada tiene los montos correctos en todos los campos"
test: "La transacción ACID no deja el estado inconsistente si falla a mitad"
test: "Si wallet.credit falla, appointment NO cambia a COMPLETED (rollback)"
```

## 10.5 Pruebas End-to-End

```
test e2e: "Flujo C completo: Solicitud → Negociación → Confirmación → QR → Bipartito → Factura"
test e2e: "Flujo D completo: Solicitud → Negociación → Pago → QR → Bipartito → Factura → Liberación fondos"
test e2e: "Flujo E completo: Emergencia → Notificación → Aceptación → Bipartito → Factura"
test e2e: "Flujo A completo: Registro Proveedor → KYC → Aprobación Admin → Publicar Servicio"
test e2e: "Flujo B completo: Agregar familiar → Límite 5 → QR incluye familiar"
```

---

<a name="parte-11"></a>
# PARTE 11 — GUÍA DE IMPLEMENTACIÓN PASO A PASO

> **INSTRUCCIÓN:** Implementa en este orden estricto. Completa y prueba cada fase antes de pasar a la siguiente. Haz un commit etiquetado por cada fase completada.

| Fase | Módulo | Estimado | Commit tag |
|------|--------|----------|-----------|
| 1 | Modelos de Base de Datos | 1 día | `phase/1-database-models` |
| 2 | APIs de Proveedor y KYC | 2 días | `phase/2-provider-kyc-api` |
| 3 | APIs de Servicios y Calendario | 1 día | `phase/3-service-listings-api` |
| 4 | APIs de Beneficiarios y QR | 1 día | `phase/4-beneficiaries-qr-api` |
| 5 | Booking + Negotiation Engine | 3 días | `phase/5-booking-engine` |
| 6 | Formulario Bipartito + Facturación | 2 días | `phase/6-bipartite-billing` |
| 7 | Event-Driven System | 1 día | `phase/7-event-system` |
| 8 | Reseñas y Moderación | 1 día | `phase/8-reviews-moderation` |
| 9 | Frontend: Marketplace | 3 días | `phase/9-frontend-marketplace` |
| 10 | Frontend: Dashboard Proveedor | 2 días | `phase/10-frontend-provider` |
| 11 | Frontend: Dashboard Cliente | 2 días | `phase/11-frontend-client` |
| 12 | Panel de Administración | 2 días | `phase/12-admin-panel` |
| 13 | Sistema de Notificaciones | 1 día | `phase/13-notifications` |
| 14 | Documentos Legales | 1 día | `phase/14-legal-docs` |
| 15 | Pruebas Completas + QA | 2 días | `phase/15-testing-qa` |

### Fase 1 — Modelos de Base de Datos
1. Agregar todos los modelos de la PARTE 2 al schema.prisma
2. Ejecutar `prisma migrate dev --name add-services-marketplace`
3. Validar con `prisma validate`
4. Crear seeds de prueba:
   - 2 proveedores con KYC completo (categorías HEALTH y LEGAL)
   - 3 servicios cada uno con los 3 niveles de precio
   - 2 usuarios con membresía y sus beneficiarios familiares
   - Datos de schedule (lunes-viernes 8:00-17:00)

### Fase 5 — Booking + Negotiation Engine (más crítica)
1. Implementar POST /api/appointments con snapshot de precios
2. Implementar POST /api/appointments/:id/provider-respond (Negotiation Engine)
3. Implementar POST /api/appointments/:id/client-confirm
4. Implementar POST /api/appointments/:id/pay (prepago)
5. Implementar POST /api/appointments/:id/cancel (con todas las reglas)
6. Probar Flujo C completo
7. Probar Flujo D completo
8. Probar Flujo E (emergencia)
9. Verificar que todas las notificaciones se envían en cada transición de estado

### Fase 6 — Formulario Bipartito + Facturación (la más compleja)
1. Implementar Fase 1 del bipartito (proveedor llena)
2. Implementar Fase 2 del bipartito (cliente acepta/rechaza)
3. Implementar la transacción ACID completa al aceptar
4. Implementar generación de PDF de factura (`@react-pdf/renderer`)
5. Implementar acreditación del wallet del proveedor
6. Implementar ServiceAccountingEntry
7. Probar el flujo completo desde QR hasta factura
8. Probar rollback si algún paso del ACID falla

---

<a name="parte-12"></a>
# PARTE 12 — REGLAS INQUEBRANTABLES DEL SISTEMA

> **INSTRUCCIÓN:** Estas reglas nunca pueden romperse bajo ninguna circunstancia. Si en algún punto de la implementación una de estas reglas entra en conflicto con algún otro requerimiento, esta lista tiene MÁXIMA PRIORIDAD.

```
REGLA 1: El internalPrice NUNCA llega al frontend del cliente ni del proveedor público.
         Solo admin/accountant lo ven. Filtrar en el serializador de respuesta, no solo
         en la lógica de negocio.

REGLA 2: Los cálculos de precios SIEMPRE se hacen en el servidor.
         El frontend NUNCA envía precios calculados. Solo envía IDs.

REGLA 3: Toda operación financiera es ACID.
         Usa transacciones Prisma para: wallet.credit + comisión + actualización de cita.
         Todo en un solo bloque atómico. Si falla una, fallan todas.

REGLA 4: Las ClientReview son INVISIBLES para el cliente.
         Solo las ven otros proveedores verificados y el Admin.
         NO deben aparecer nunca en ninguna respuesta de API que el cliente consuma.

REGLA 5: El QR es del titular y cubre a sus beneficiarios.
         No hay un QR por beneficiario. Es uno por cuenta.
         Al escanear, el proveedor selecciona a quién está atendiendo.

REGLA 6: Un servicio prepagado confirmado (PAID) NO SE PUEDE CANCELAR desde la plataforma.
         El cliente debe ir a soporte. Esta restricción es legal y de negocio.

REGLA 7: El proveedor SIEMPRE debe registrar el servicio en la plataforma.
         El sistema lo registra como obligación. Sin bipartito firmado, no hay pago.

REGLA 8: Todos los cambios de precio de servicios requieren aprobación del Admin.
         El proveedor no puede cambiar precios unilateralmente. Se guarda en pendingUpdate.

REGLA 9: El IVA es 15% (Ecuador). Almacenado en variable de entorno IVA_PERCENTAGE.
         NUNCA hardcodear el valor en el código. Si cambia, solo se actualiza la variable.

REGLA 10: Todo evento relevante queda registrado en SystemEvent.
          Si no está en la DB, no ocurrió. Trazabilidad total y auditoria forense.

REGLA 11: Separación total de productos y servicios.
          NO usar el carrito de productos para servicios.
          El flujo de servicios es: Booking → Negociación → Ejecución → Bipartito.

REGLA 12: Los precios se toman como snapshot al momento de crear la cita.
          Si el proveedor cambia precios después, la cita existente NO cambia.
```

---

<a name="parte-13"></a>
# PARTE 13 — VARIABLES DE ENTORNO Y CONFIGURACIÓN

```env
# ============================================
# NOTIFICACIONES
# ============================================
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
TELEGRAM_BOT_TOKEN=
RESEND_API_KEY=
EMAIL_FROM_ADDRESS=noreply@saidonclub.com

# ============================================
# ALMACENAMIENTO (SUPABASE)
# ============================================
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET_PROVIDERS=saidonclub-providers
SUPABASE_STORAGE_BUCKET_USERS=saidonclub-users

# ============================================
# QR Y SEGURIDAD
# ============================================
QR_JWT_SECRET=                        # Mínimo 256 bits de entropía
QR_JWT_EXPIRY=86400                   # 24 horas en segundos

# ============================================
# CONFIGURACIÓN FINANCIERA
# ============================================
IVA_PERCENTAGE=15                     # IVA Ecuador — NUNCA hardcodear en código
IVA_INCLUDED_BY_DEFAULT=false
COMPANY_BASE_COMMISSION_PERCENT=25    # Solo referencia — el real se calcula por servicio

# ============================================
# LÍMITES DEL SISTEMA
# ============================================
MAX_FAMILY_BENEFICIARIES=5
MAX_PERSONAL_PHOTOS=3
MAX_WORK_PHOTOS=3
MAX_BUSINESS_PHOTOS=3
MAX_AD_PHOTOS=20

# ============================================
# VENTANAS DE TIEMPO
# ============================================
APPOINTMENT_QR_EXPIRY_HOURS=24
REVIEW_WINDOW_HOURS=72                # Horas post-servicio para dejar reseña
BIPARTITE_ACCEPT_WINDOW_HOURS=24      # Horas para que el cliente acepte el bipartito
PROVIDER_RESPONSE_SLA_HOURS=2         # SLA de respuesta del proveedor (genera alerta)
EMERGENCY_RESPONSE_SLA_MINUTES=30     # SLA de emergencias

# ============================================
# FACTURACIÓN
# ============================================
INVOICE_PREFIX=SC-SRV                 # SC-SRV-202605-000001
RECEIPT_PREFIX=SC-APT                 # SC-APT-000001

# ============================================
# MAPAS
# ============================================
GOOGLE_MAPS_API_KEY=

# ============================================
# FCM (PUSH NOTIFICATIONS)
# ============================================
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

---

## Checklist de Implementación

### 🔴 CRÍTICO (bloqueante para producción)
- [ ] Service Marketplace Engine (modelos + APIs)
- [ ] Booking Engine con State Machine completa
- [ ] Negotiation Engine (propuesta de horarios)
- [ ] QR Validation System (generación + escaneo)
- [ ] Universal Service Form (Bipartito) con firma digital
- [ ] Billing Integration (generación de factura + PDF)
- [ ] Transacción ACID: servicio completado → wallet → comisión → factura
- [ ] Regla: internalPrice NUNCA al frontend

### 🟠 IMPORTANTE (para lanzamiento completo)
- [ ] KYC avanzado por categoría profesional
- [ ] Sistema de beneficiarios familiares (límite 5)
- [ ] Agenda inteligente del proveedor (schedule + blocked dates)
- [ ] Sistema de reputación bidireccional
- [ ] Event-Driven System (cola de eventos)
- [ ] Panel de administración (KYC, aprobaciones, contabilidad)

### 🟡 MEJORA (post-lanzamiento)
- [ ] WhatsApp Business API automation
- [ ] Dashboard de métricas avanzado
- [ ] Notificaciones push (FCM)
- [ ] Telegram Bot
- [ ] Exportación CSV/Excel de contabilidad
- [ ] Mapa con ubicaciones de proveedores

---

_Documento Maestro SaidonClub v3.0_
_Unificación: Especificación v2.0 (1896 líneas) + Análisis Arquitectural Crítico_
_Fecha: 2026-05-01_
_Versión: 3.0 — DEFINITIVA_
_Estado: Instrucción directa para agente de implementación (OpenCode / Claude Code)_
