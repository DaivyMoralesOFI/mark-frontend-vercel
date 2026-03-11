# Mark Frontend — OFI Summer AI

> Plataforma de marketing potenciada por IA para creación de contenido, extracción de Brand DNA y gestión de campañas.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos y Dominios](#módulos-y-dominios)
- [Arquitectura y Patrones](#arquitectura-y-patrones)
- [API e Integraciones](#api-e-integraciones)
- [Próximos Pasos](#próximos-pasos)
- [Guías de Desarrollo](#guías-de-desarrollo)

---

## 🛠 Tecnologías

| Categoría | Librería / Herramienta |
|---|---|
| Framework | React 19 + Vite 6 |
| Lenguaje | TypeScript 5.7 |
| Routing | React Router DOM 7 |
| State Management | Redux Toolkit + Zustand |
| Server State | TanStack Query (React Query) v5 |
| UI / Componentes | Radix UI + shadcn/ui + Tailwind CSS v4 |
| Formularios | React Hook Form + Zod |
| Animaciones | Framer Motion |
| Visualización de flujos | ReactFlow |
| Gráficos | Recharts |
| HTTP Client | Axios |
| Fechas | Luxon + date-fns |
| Notificaciones | Sonner |
| Markdown | react-markdown |

---

## 🚀 Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/) (v10 o superior)
- Archivo `.env` configurado con las variables de API

```bash
npm install -g pnpm
```

### Pasos para instalar y ejecutar

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd mark-frontend
   ```
2. Instalar dependencias:
   ```bash
   pnpm install
   ```
3. Crear el archivo `.env` en la raíz con las variables necesarias (ver `.env.example` o solicitar al equipo).

4. Iniciar el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```
5. Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

### Comandos disponibles

| Comando | Descripción |
|---|---|
| `pnpm run dev` | Servidor de desarrollo con HMR |
| `pnpm run build` | Build de producción (TypeScript + Vite) |
| `pnpm run preview` | Preview del build de producción |
| `pnpm run lint` | Lint con ESLint |

---

## 📂 Estructura del Proyecto

La arquitectura sigue un patrón de **separación de capas** con organización por dominio de negocio:

```
📂 src/
 ┣ 📂 assets/              # Recursos estáticos (imágenes, iconos, logos)
 ┣ 📂 core/                # Infraestructura central y servicios compartidos
 ┣ 📂 domains/             # Lógica de negocio organizada por dominio
 ┣ 📂 modules/             # Módulos de UI y orquestación por feature
 ┣ 📂 shared/              # Componentes, hooks y utilidades reutilizables
 ┣ 📜 App.tsx              # Componente raíz con providers globales
 ┣ 📜 main.tsx             # Entry point de la aplicación
 ┗ 📜 index.css            # Estilos globales y tokens de diseño
```

---

## 🗂 Módulos y Dominios

### 📂 `domains/` — Lógica de Negocio por Dominio

> Cada dominio contiene su propia lógica de datos, servicios, tipos y estado. Son agnósticos de UI.

```
📂 domains/
 ┣ 📂 auth/                    # Autenticación
 ┃ ┣ 📂 components/            # Componentes de login/registro
 ┃ ┣ 📂 hooks/                 # useAuth
 ┃ ┣ 📂 page/                  # AuthPage
 ┃ ┣ 📂 services/              # Auth service
 ┃ ┣ 📂 store/                 # AuthProvider + Redux auth slice
 ┃ ┗ 📂 types/                 # Tipos de usuario

 ┣ 📂 creation-studio/         # Motor de creación de contenido AI
 ┃ ┣ 📂 brand-dna/             # Extracción y visualización de Brand DNA
 ┃ ┃ ┣ 📂 brand-dna-extractor/ # Feature completo del extractor
 ┃ ┃ ┃ ┣ 📂 hooks/             # useBrandExtractor
 ┃ ┃ ┃ ┣ 📂 pages/             # Página principal del extractor
 ┃ ┃ ┃ ┣ 📂 schemas/           # Validación Zod del Brand DNA
 ┃ ┃ ┃ ┣ 📂 services/          # Llamadas a API (n8n webhook)
 ┃ ┃ ┃ ┗ 📂 utils/             # Helpers de transformación
 ┃ ┃ ┣ 📂 components/          # Componentes del Brand DNA
 ┃ ┃ ┃ ┣ 📜 BrandProfileProgress.tsx
 ┃ ┃ ┃ ┣ 📜 BrandToneSection.tsx
 ┃ ┃ ┃ ┣ 📜 ColorPaletteSection.tsx
 ┃ ┃ ┃ ┣ 📜 CompanyDropdown.tsx
 ┃ ┃ ┃ ┣ 📜 CompanySelectorModal.tsx
 ┃ ┃ ┃ ┣ 📜 LogoSection.tsx
 ┃ ┃ ┃ ┣ 📜 TypographySection.tsx
 ┃ ┃ ┃ ┗ 📜 UsageFeaturesSection.tsx
 ┃ ┃ ┗ 📂 style-profile/       # Perfil de estilo del usuario
 ┃ ┃   ┣ 📜 StyleProfilePage.tsx
 ┃ ┃   ┣ 📜 FeedbackOverview.tsx
 ┃ ┃   ┣ 📜 LearningProgress.tsx
 ┃ ┃   ┣ 📜 LearningSettings.tsx
 ┃ ┃   ┣ 📜 RecentFeedback.tsx
 ┃ ┃   ┗ 📜 StylePreferences.tsx
 ┃ ┣ 📂 chat-coach/            # Chat con IA - Marketing Coach
 ┃ ┃ ┣ 📂 chat-coach-modal/    # Versión modal del chat
 ┃ ┃ ┣ 📂 components/          # ChatInput, ChatMessage, ChatMessagesList,
 ┃ ┃ ┃                         #   QuickQuestions, TypingIndicator
 ┃ ┃ ┣ 📂 hooks/               # useChatCoach
 ┃ ┃ ┣ 📂 services/            # Chat AI service
 ┃ ┃ ┣ 📂 store/               # Estado del chat (Zustand)
 ┃ ┃ ┗ 📂 types/               # Tipos de mensajes y sesiones
 ┃ ┣ 📂 post-creator/          # Creación de posts con IA
 ┃ ┃ ┣ 📂 components/          # AISuggestion, CreatePostModal,
 ┃ ┃ ┃                         #   DescriptionInput, ImageUpload,
 ┃ ┃ ┃                         #   PlatformSelector, TrendsSection
 ┃ ┃ ┣ 📂 hooks/               # usePostCreator
 ┃ ┃ ┣ 📂 services/            # Post generation API
 ┃ ┃ ┣ 📂 store/               # Estado del post creator
 ┃ ┃ ┗ 📂 types/               # Tipos de posts y plataformas
 ┃ ┗ 📂 video-creator/         # Generación de videos con IA
 ┃   ┣ 📜 createVideoModal.tsx # Modal principal de creación de video
 ┃   ┗ 📂 services/            # Video generation API

 ┣ 📂 dashboard/               # Dashboard principal y calendario
 ┃ ┣ 📂 calendar/              # Calendario de contenido
 ┃ ┃ ┗ 📂 content-post/        # Gestión de posts en calendario
 ┃ ┃   ┣ 📂 components/        # PostCard, CalendarGrid, etc.
 ┃ ┃   ┣ 📂 hooks/             # useContentPost
 ┃ ┃   ┣ 📂 services/          # CRUD de posts
 ┃ ┃   ┗ 📂 store/             # Estado del calendario
 ┃ ┣ 📂 components/            # Componentes del dashboard
 ┃ ┣ 📂 data/                  # Mock data y fixtures
 ┃ ┣ 📂 management/            # Gestión de campañas
 ┃ ┗ 📂 page/                  # DashboardPage

 ┗ 📂 social-network/          # Integración con redes sociales
   ┣ 📂 components/            # Conectores de plataformas
   ┣ 📂 data/                  # Config de redes sociales
   ┗ 📂 page/                  # SocialNetworkPage
```

---

### 📂 `modules/` — Orquestación de UI por Feature

> Los módulos consumen dominios y organizan rutas, layouts y componentes de UI de alto nivel.

```
📂 modules/
 ┗ 📂 creation-studio/
   ┣ 📂 components/                # Componentes de UI del Creation Studio
   ┃ ┣ 📂 alerts/                  # Alertas contextuales
   ┃ ┣ 📂 card/                    # Cards de contenido
   ┃ ┣ 📂 dropdown/                # Dropdowns del studio
   ┃ ┣ 📂 flow/                    # Contenedor principal de ReactFlow
   ┃ ┣ 📂 flow-nodes/              # Nodos personalizados del grafo Brand DNA
   ┃ ┃ ┣ 📜 color-node.tsx         # Nodo de paleta de colores
   ┃ ┃ ┣ 📜 identity-node.tsx      # Nodo de identidad de marca
   ┃ ┃ ┣ 📜 logo-node.tsx          # Nodo del logo (raíz del grafo)
   ┃ ┃ ┣ 📜 typography-node.tsx    # Nodo de tipografía
   ┃ ┃ ┗ 📜 voice-node.tsx         # Nodo de voz y tono
   ┃ ┣ 📂 header/                  # Header del studio
   ┃ ┣ 📂 navbar/                  # Navegación interna
   ┃ ┗ 📂 sidebar/                 # Sidebar del studio
   ┣ 📂 hooks/                     # useWorkflow, useContentFlow
   ┣ 📂 layout/                    # CreationStudioLayout
   ┣ 📂 pages/                     # Páginas del módulo
   ┃ ┣ 📜 brand-dna-extractor.tsx  # Página de extracción de Brand DNA
   ┃ ┣ 📜 create-new-content-page.tsx  # Selección de tipo de contenido
   ┃ ┗ 📜 workflow-content-page.tsx    # Flujo de trabajo de contenido (ReactFlow)
   ┣ 📂 schemas/                   # Schemas Zod de validación
   ┣ 📂 service/                   # brand-service.ts (API calls)
   ┣ 📂 store/                     # brandSlice (Redux)
   ┣ 📂 types/                     # Tipos del módulo
   ┗ 📂 utils/                     # Utilidades del flow
```

---

### 📂 `core/` — Infraestructura Central

```
📂 core/
 ┣ 📂 api/
 ┃ ┣ 📜 api-config.ts        # URLs base, endpoints y Axios client configurado
 ┃ ┣ 📜 apiClient.ts         # Interceptores de request/response + manejo de errores
 ┃ ┗ 📜 apiErrors.ts         # Tipado de errores de API
 ┣ 📂 config/
 ┃ ┣ 📜 query-client.ts      # Configuración global de TanStack Query
 ┃ ┗ 📜 query-keys.ts        # Keys centralizadas para caching
 ┣ 📂 context/
 ┣ 📂 hooks/                 # Hooks de infraestructura
 ┣ 📂 providers/             # QueryProvider
 ┣ 📂 router/                # ThemeProvider y router config
 ┣ 📂 routes/
 ┃ ┣ 📜 routes.tsx           # Router raíz con BrowserRouter
 ┃ ┣ 📜 creation-studio.app.tsx  # Rutas del Creation Studio (lazy-loaded)
 ┃ ┗ 📜 dashboard.app.tsx    # Rutas del Dashboard (lazy-loaded)
 ┣ 📂 schemas/               # Schemas Zod globales
 ┣ 📂 services/              # Servicios de infraestructura
 ┣ 📂 store/
 ┃ ┣ 📜 brandSlice.ts        # Redux slice del Brand DNA activo
 ┃ ┣ 📜 middleware.ts        # Redux middleware
 ┃ ┣ 📜 rootReducer.ts       # Root reducer
 ┃ ┗ 📜 store.ts             # Configuración de la store
 ┣ 📂 type/                  # Tipos globales del core
 ┗ 📂 utils/
   ┣ 📜 schema-validator.ts  # Validación soft con Zod (validateSchemaSoft)
   ┣ 📜 api-error-handler.ts # isApiError + formateo de errores
   ┗ ...
```

---

### 📂 `shared/` — Componentes y Utilidades Reutilizables

```
📂 shared/
 ┣ 📂 components/
 ┃ ┣ 📂 ui/                  # 47 componentes atómicos (shadcn/ui)
 ┃ ┃                         #   Button, Input, Dialog, Select, Tabs,
 ┃ ┃                         #   Badge, Avatar, Calendar, Chart, etc.
 ┃ ┣ 📂 brand/               # Componentes de branding compartidos
 ┃ ┣ 📂 breadcrumbs/         # BreadcrumbNav
 ┃ ┣ 📂 button/              # Variantes de botones
 ┃ ┣ 📂 cards/               # Cards genéricas
 ┃ ┣ 📂 common/              # Componentes de uso general
 ┃ ┣ 📂 dropdown/            # Dropdowns y menús
 ┃ ┣ 📂 error-state/         # Páginas y componentes de error
 ┃ ┣ 📂 header/              # Headers shared (AppHeader, SiteHeader, ToggleTheme)
 ┃ ┣ 📂 icons/               # Íconos personalizados
 ┃ ┣ 📂 loading-state/       # Spinners y skeletons
 ┃ ┣ 📂 sidebar/             # AppSidebar
 ┃ ┣ 📂 table/               # DataTable + TanStack Table configs
 ┃ ┣ 📂 tooltip/             # TooltipHover
 ┃ ┗ 📜 ScheduleModal.tsx    # Modal de programación de posts
 ┣ 📂 hooks/                 # Hooks compartidos (useIsMobile, useModal, etc.)
 ┣ 📂 layout/                # Layouts base
 ┣ 📂 pages/                 # Página 404 / Not Found
 ┣ 📂 types/                 # Tipos compartidos
 ┗ 📂 utils/                 # Utilidades (formatters, helpers, cn)
```

---

## 🗺 Rutas de la Aplicación

| Ruta | Descripción |
|---|---|
| `/` | Redirige a `/dashboard` |
| `/auth` | Página de autenticación |
| `/app/dashboard` | Dashboard principal y calendario de contenido |
| `/app/creation-studio/new/content` | Selector de tipo de contenido nuevo |
| `/app/creation-studio/new/content/:uuid` | Flujo de trabajo de contenido (ReactFlow) |
| `/app/creation-studio/brand-dna-extractor` | Extractor de Brand DNA con visualización de grafo |

---

## 🔌 API e Integraciones

### n8n Webhooks (Base URL: `https://n8n.sofiatechnology.ai/webhook`)

| Endpoint | Método | Descripción |
|---|---|---|
| `/extract-brand-dna` | POST | Extrae el Brand DNA a partir de una URL de empresa |
| `/generate-image-v2` | POST | Genera imágenes con IA |
| `/generated-image-v2` | GET | Recupera una imagen generada |
| `/85a5cbee-1808-4d99-9528-f91b9c6cbe31` | POST | Edición de imágenes con IA |

### Configuración del cliente Axios

- **Timeout**: 150 000 ms (2.5 min) — necesario para generación de imágenes con IA
- **Interceptores**: Logging detallado en desarrollo para requests y responses
- **Manejo de errores**: Tipado con `isApiError()` y mensajes de usuario amigables

---

## 🧠 Brand DNA — Feature Principal

La funcionalidad de **Brand DNA Extractor** es el corazón del producto:

1. **Extracción**: El usuario introduce la URL de su empresa → llama al webhook `/extract-brand-dna`
2. **Validación**: La respuesta se valida con schemas Zod (`BrandExtractorResponseSchema`)
3. **Visualización**: Se genera un **grafo interactivo con ReactFlow** con nodos personalizados:
   - `logo-node` — Raíz del grafo con el logo de la marca
   - `identity-node` — Nombre, misión y valores
   - `color-node` — Paleta de colores con previews
   - `typography-node` — Tipografías primaria y secundaria
   - `voice-node` — Tono y voz de la marca
4. **Selección activa**: El usuario puede tener una marca activa que se usa como context en generación de contenido

---

## 🚧 Próximos Pasos

### Prioridad Alta

- [ ] **Corregir errores de build de TypeScript** — Resolver los errores de tipos en módulos de `domains/` y `modules/` para lograr un build de producción limpio
- [ ] **Implementar flujo completo del Content Workflow** (`workflow-content-page.tsx`) — Conectar nodos del grafo con generación real de contenido via AI
- [ ] **Completar integración del Video Creator** — El modal `createVideoModal.tsx` está implementado pero falta conectar el servicio de generación de video
- [ ] **Autenticación real** — El `AuthProvider` está configurado pero el flujo de login/registro necesita validación end-to-end

### Prioridad Media

- [ ] **Dashboard Calendar** — Completar el módulo de `content-post` dentro del calendario con CRUD completo de posts programados
- [ ] **Social Network Integration** — El dominio `social-network` tiene la estructura pero falta la integración real con APIs de redes sociales (Meta, LinkedIn, X)
- [ ] **Style Profile** — Implementar el sistema de aprendizaje en `style-profile/` para personalizar sugerencias de IA según el perfil del usuario
- [ ] **Chat Coach** — Verificar y completar el `chat-coach-modal` para uso en contexto de contenido específico
- [ ] **Campaña Management** — Implementar el módulo `dashboard/management/` para gestión de campañas

### Prioridad Baja / Mejoras

- [ ] **Testing** — Agregar tests unitarios para servicios y schemas Zod, y tests de integración para los flujos principales
- [ ] **Optimización de performance** — Revisar re-renders en componentes del Brand DNA grafo
- [ ] **Documentación de componentes** — Agregar JSDoc/Storybook para los 47 componentes UI de `shared/components/ui/`
- [ ] **PWA / Mobile** — Hacer responsive el Creation Studio para tablets y móvil

---

## 🗃 Artefactos en Legacy / Por Migrar

> Los siguientes archivos y estructuras existen en el repositorio pero pertenecen a la arquitectura anterior o están pendientes de migración:

| Artefacto | Ubicación | Estado | Notas |
|---|---|---|---|
| `src/components/` | `src/components/` | ⚠️ Legacy | Directorio de la arquitectura anterior, aún no migrado a `shared/` o `domains/` |
| Módulos sin dominio | `src/modules/` (contiene solo `creation-studio`) | 🔄 En proceso | La arquitectura migra funcionalidad a `domains/`, `modules/` queda como capa de UI |
| Mock data del dashboard | `src/domains/dashboard/data/` | ⚠️ Mock | Datos de prueba — reemplazar con servicios reales |
| Mock data de social network | `src/domains/social-network/data/` | ⚠️ Mock | Datos de redes sociales hardcodeados |
| `docs/marketing-project-wiki.pdf` | `docs/` | 📄 Referencia | Wiki del proyecto original — revisar vigencia |
| `@/` (directorio raíz) | `@/` | ❓ Investigar | Directorio de alias path, posible artefacto de configuración |

---

## 🏗 Arquitectura y Patrones

### Separación de Capas

```
┌─────────────────────────────────────────────┐
│               modules/ (UI Layer)            │  ← Layouts, rutas, orquestación de UI
├─────────────────────────────────────────────┤
│              domains/ (Domain Layer)         │  ← Lógica de negocio, servicios, estado
├─────────────────────────────────────────────┤
│               core/ (Infrastructure)         │  ← API, Firebase, Router, Store global
├─────────────────────────────────────────────┤
│              shared/ (Shared Library)        │  ← Componentes, hooks y utils reutilizables
└─────────────────────────────────────────────┘
```

### Gestión de Estado

| Herramienta | Uso |
|---|---|
| **Redux Toolkit** | Estado global del Brand DNA activo (`brandSlice`), auth |
| **TanStack Query** | Cache de datos del servidor, fetching, invalidación |
| **Zustand** | Estado local de módulos (chat coach, post creator) |
| **React Hook Form** | Estado de formularios |
| **useState / useReducer** | Estado local de componentes |

### Validación con Zod

Todo dato externo (API responses, formularios) pasa por validación Zod con la función `validateSchemaSoft()` que:
- Valida el schema sin lanzar excepción por defecto
- Loguea warnings en consola cuando hay discrepancias
- Permite continuar con los datos si el schema es compatible

### Lazy Loading

Todas las páginas del Creation Studio y Dashboard están cargadas con `React.lazy()` para optimizar el bundle inicial.

---

## 👥 Convenciones de Código

### Nomenclatura

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `BrandDnaExtractor.tsx` |
| Hooks | camelCase con prefijo `use` | `useBrandExtractor.ts` |
| Servicios | camelCase | `brand-service.ts` |
| Tipos / Interfaces | PascalCase | `BrandExtractor` |
| Redux Slices | camelCase con sufijo `Slice` | `brandSlice.ts` |
| Schemas Zod | PascalCase con sufijo `Schema` | `BrandExtractorSchema` |
| Archivos de dominio | kebab-case | `brand-dna-extractor.tsx` |

### Organización de Imports

```typescript
// 1. Librerías externas
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Core / infraestructura
import { API_CONFIG } from "@/core/api/api-config";

// 3. Dominio actual
import { getBrandDna } from "../services/brand-service";

// 4. Shared
import { Button } from "@/shared/components/ui/button";
```

---

## 🔧 Configuración del Entorno

Las variables de entorno se definen en `.env`:

```env
VITE_IG_ACCESS_TOKEN=...
VITE_IG_USER_ID=...
VITE_FB_PAGE_ACCESS_TOKEN=...
VITE_FB_PAGE_ID=...
```

---

*Última actualización: Febrero 2026 — OFI Summer AI Team*
