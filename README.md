# 🇮🇹 Maestria

**Plataforma de aprendizaje de italiano como lengua extranjera, potenciada por IA**, pensada para preparar a estudiantes adolescentes hacia estándares internacionales de certificación (CILS/PLIDA), con corrección automática de textos, generación de ejercicios personalizados y seguimiento pedagógico para profesores.

🔗 **Producción:** [maestria-sepia.vercel.app](https://maestria-sepia.vercel.app)

---

## 🎯 Objetivo

Maestria existe para resolver un problema concreto de la enseñanza de idiomas: **corregir y dar feedback de calidad a la escritura de cada alumno toma muchísimo tiempo del profesor**, y sin ese feedback frecuente el progreso del alumno se estanca.

La plataforma usa **Google Gemini** como motor de corrección e inteligencia pedagógica para que cada alumno reciba, de forma instantánea:

- Una evaluación profesional de su escrito (nivel CEFR detectado, puntaje, fortalezas y debilidades)
- Correcciones línea por línea con explicación del *por qué*
- Ejercicios de práctica generados específicamente sobre sus errores reales
- Un sistema de progreso gamificado (XP, niveles, racha de días, logros) para sostener la motivación

Mientras el profesor mantiene el control pedagógico: organiza a sus alumnos en cursos, revisa su evolución real, y puede generar tareas dirigidas a partir de los errores detectados por la IA.

---

## 👥 Roles de la plataforma

| Rol | Qué puede hacer |
|---|---|
| **Studente** (alumno) | Escribir textos para corrección, ver feedback detallado, practicar con ejercicios CILS, completar tareas asignadas, ver su progreso y ranking |
| **Insegnante** (profesor) | Aprobar/gestionar alumnos, organizarlos en cursos, generar tareas con IA basadas en errores reales, ver el detalle de cada alumno |
| **Admin** | Aprobar registros, gestionar usuarios y roles, supervisión general de la plataforma |

---

## 🧩 Partes que componen la app

### 1. Corrección de escritura con IA (`/student/write` → `/api/correct`)
El alumno escribe un texto (email, narrativo, argumentativo, etc.) indicando nivel objetivo y tipo de texto. Gemini lo evalúa como lo haría un examinador real: nivel detectado, puntaje sobre 100, coherencia/léxico/gramática/cumplimiento de la consigna, fortalezas, debilidades, sugerencias, y cada corrección puntual con su explicación.

### 2. Resultado de corrección (`/student/corrections/[id]`)
La pantalla de feedback, diseñada con un criterio pedagógico explícito: primero la evidencia concreta (el texto del alumno con sus errores, en modo **"Pratica"** con *tap-to-reveal* para activar recuerdo activo), después la reflexión sintetizada (fortalezas/debilidades/sugerencias), y al final las acciones a futuro (próximos pasos, progreso por nivel CEFR).

### 3. Ejercicios CILS (`/student/exercises`)
Práctica de estructuras gramaticales al estilo examen oficial (completar con artículos/pronombres, conjugar verbos, elección múltiple, situaciones comunicativas), generados por IA para cualquier nivel A2-C1, con corrección automática y feedback pedagógico detallado por cada error.

### 4. Tareas dirigidas (`/student/tasks`, generadas desde `/teacher/students/[id]`)
El profesor puede generar, con un clic, una tarea de práctica (escritura libre, completar, transformar oraciones, o reescribir) basada específicamente en los errores reales que la IA detectó en el alumno — no genérica.

### 5. Guías de escritura (`/student/guides`)
Biblioteca de guías por tipo de texto y nivel CEFR, más un asistente de IA opcional para alumnos que no saben por dónde empezar a escribir (les hace preguntas guiadas y arma un esquema).

### 6. Gamificación (XP, niveles, racha, logros, ranking)
Sistema de niveles (Novizio → Maestro) basado en XP ganado por cada corrección y tarea completada, racha de días consecutivos de actividad real, 10 logros desbloqueables según métricas verificables (no inventadas), y un ranking entre compañeros.

### 7. Gestión docente (`/teacher`, `/teacher/students`)
Dashboard del profesor con estadísticas reales de su clase, organización de alumnos en **cursos** (ej. "7mo", "9no"), perfil individual de cada alumno con su historial de escritos y errores frecuentes, y generación de tareas dirigidas por IA.

### 8. Panel de administración (`/admin`)
Aprobación de registros nuevos (alumnos y profesores), gestión de usuarios y roles, reasignación de alumnos entre profesores.

---

## 🛠️ Stack técnico

- **Framework:** Next.js 14 (App Router)
- **Base de datos / Auth:** Supabase (Postgres + Row Level Security + Auth)
- **IA:** Google Gemini (REST API directa, modelo `gemini-3.5-flash`)
- **UI:** Tailwind CSS + shadcn/ui + Framer Motion
- **Despliegue:** Vercel
- **Idioma de la interfaz:** Italiano (100%, alumnos y profesores son hispanohablantes aprendiendo/enseñando italiano, pero la plataforma está en italiano para reforzar la inmersión)

---

## 🔐 Seguridad y datos

- Row Level Security (RLS) en Supabase: cada alumno solo accede a sus propios datos; los profesores acceden a los datos de sus alumnos; el admin tiene acceso total.
- Las operaciones que requieren bypass de RLS (lecturas cruzadas legítimas, como el ranking o el dashboard del profesor) usan exclusivamente el `service_role` de Supabase desde el servidor, nunca expuesto al cliente.
- La clave de la API de Gemini se usa únicamente en endpoints del servidor (`/api/*`), nunca en el navegador.

---

## 📁 Estructura del proyecto

```
app/
  (auth)/              → login, registro
  (dashboard)/
    student/            → todas las páginas del alumno
    teacher/            → todas las páginas del profesor
    admin/              → todas las páginas del admin
  api/                  → endpoints (corrección, tareas, ejercicios, cursos, admin)
  actions/              → server actions (auth, etc.)
components/
  student/, teacher/, admin/, layout/, ui/, theme/
lib/
  supabase/             → clientes de Supabase (browser, server, admin) y schema.sql
  gemini/               → cliente de Gemini con reintentos y validación
  utils/                → XP, niveles, logros, racha, fechas
  validations/          → esquemas Zod de validación de IA
  constants/            → guías, logros
```

---

## 🚧 Estado del proyecto

Maestria está en desarrollo activo. El núcleo (autenticación, corrección con IA, gestión de alumnos/profesores, gamificación) está funcional en producción. El diseño visual y la jerarquía de información se están refinando pantalla por pantalla con un criterio explícito de UX/pedagogía/ciencia cognitiva, no solo estético.
