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

### 1. Corrección de escritura con IA — *Scrittura* (`/student/write` → `/api/correct`)

Es el corazón pedagógico de la plataforma. El alumno elige un **tipo de texto** (email formal/informal, narrativo, descriptivo, argumentativo, reclamo, artículo de opinión) y un **nivel CEFR objetivo** (A1-C2), opcionalmente pega la consigna del ejercicio, y escribe su texto en italiano.

Al enviarlo, Gemini actúa como **un examinador real de un examen de certificación internacional** (CILS/CELI/PLIDA) y devuelve, en segundos:
- **Nivel CEFR detectado** según la calidad real del texto (no necesariamente el nivel que el alumno eligió como objetivo)
- **Puntaje sobre 100**, desglosado en 4 criterios oficiales de evaluación: coherencia textual, léxico, gramática y cumplimiento de la consigna
- Si el texto **cumple o no** los requisitos mínimos para ese nivel
- Fortalezas y debilidades concretas, con ejemplos tomados literalmente de lo que escribió
- **Correcciones línea por línea**: cada error señalado con el fragmento original, la forma correcta, y la explicación gramatical del *por qué*
- Próximos pasos de estudio concretos

Esto simula exactamente la dinámica de una **prueba de producción escrita** de un examen de italiano como lengua extranjera: se evalúa con los mismos criterios (coherencia, léxico, gramática, adecuación a la consigna) que usaría un examinador humano certificado, para que el alumno se entrene bajo el mismo estándar con el que después va a ser evaluado en un examen real.

### 2. Resultado de corrección (`/student/corrections/[id]`)

(ver arriba la descripción pedagógica del flujo: evidencia → reflexión → acción)

### 3. Ejercicios CILS — *Esercizi CILS* (`/student/exercises`)

Mientras "Scrittura" entrena la **producción libre** de texto, **Esercizi CILS** entrena específicamente el tipo de ejercicios de **análisis de estructuras de la lengua** que aparecen en la parte de gramática/comprensión de los exámenes de certificación internacional de italiano (CILS y similares) — el formato real de "completa el texto", no redacción libre.

Hay 4 tipos de prueba, generados por IA en el momento, para cualquier nivel A2-C1, sobre un texto nuevo e inédito cada vez:

1. **Aggettivi e pronomi** — completar un texto con la forma correcta de adjetivos/pronombres
2. **Forme verbali** — completar un texto conjugando los verbos indicados entre paréntesis
3. **Scelta multipla** — elegir, entre 4 opciones, la palabra correcta para cada espacio del texto
4. **Situazioni comunicative** — identificar en qué contexto comunicativo real (un anuncio, un mensaje, una conversación) se usaría cada expresión dada

Cada prueba viene con una sección teórica ("Prima di iniziare") que explica la regla gramatical antes de practicar, y al corregir, el alumno recibe **feedback pedagógico explicado**, no solo "correcto/incorrecto" — la misma profundidad explicativa que en la corrección de escritura, pero aplicada al formato de examen de gramática.

Esto convierte a Maestria en una herramienta de **preparación específica para examen**, no solo de práctica general de escritura: el alumno entrena tanto la producción libre (Scrittura) como el formato exacto de ejercicios estructurales que va a encontrar el día del examen real (Esercizi CILS).

### 4. Tareas dirigidas (`/student/tasks`, generadas desde `/teacher/students/[id]`)

El profesor puede generar, con un clic, una tarea de práctica (escritura libre, completar, transformar oraciones, o reescribir) basada específicamente en los errores reales que la IA detectó en el alumno — no genérica.

### 5. Guías de escritura — *Guide* (`/student/guides`)

Es la biblioteca de **material de consulta y apoyo previo a escribir**, organizada por tipo de texto y nivel CEFR. Cada guía explica la estructura esperada de ese tipo de texto (por ejemplo: cómo abrir y cerrar un email formal, qué conectores usar en un texto argumentativo, qué tiempos verbales son típicos de un narrativo), con frases y fórmulas hechas en italiano listas para reutilizar.

Sirve como el paso **antes** de "Scrittura": el alumno que no sabe cómo encarar un tipo de texto específico (o nunca escribió un reclamo formal en italiano, por ejemplo) puede consultar la guía correspondiente primero. Además incluye un **asistente de IA opcional** (colapsado por defecto) para quien está completamente bloqueado: le hace preguntas guiadas paso a paso y le arma un esquema de ideas para empezar a escribir, que se puede enviar directo a la página de escritura.

En conjunto, **Guide → Scrittura → Esercizi CILS** forman el ciclo de aprendizaje completo: primero aprender la estructura (Guide), después producir un texto real y recibir evaluación de examinador (Scrittura), y en paralelo entrenar el formato específico de ejercicios de examen (Esercizi CILS).

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
