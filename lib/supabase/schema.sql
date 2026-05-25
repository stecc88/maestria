-- Habilitar extensión uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles (extiende auth.users de Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de profesores
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_code TEXT UNIQUE NOT NULL,
  bio TEXT,
  institution TEXT,
  approved_at TIMESTAMPTZ
);

-- Tabla de alumnos
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id),
  teacher_code_used TEXT,
  target_level TEXT NOT NULL CHECK (target_level IN ('A1','A2','B1','B2','C1','C2')),
  current_level TEXT CHECK (current_level IN ('A1','A2','B1','B2','C1','C2')),
  xp_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ
);

-- Tabla de escritos
CREATE TABLE writings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  writing_type TEXT NOT NULL,
  target_level TEXT NOT NULL CHECK (target_level IN ('A1','A2','B1','B2','C1','C2')),
  word_count INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de correcciones
CREATE TABLE corrections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  detected_level TEXT CHECK (detected_level IN ('A1','A2','B1','B2','C1','C2')),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  exam_compliant BOOLEAN,
  score_coherence INTEGER CHECK (score_coherence BETWEEN 0 AND 25),
  score_vocabulary INTEGER CHECK (score_vocabulary BETWEEN 0 AND 25),
  score_grammar INTEGER CHECK (score_grammar BETWEEN 0 AND 25),
  score_task_completion INTEGER CHECK (score_task_completion BETWEEN 0 AND 25),
  pros JSONB,
  cons JSONB,
  suggestions JSONB,
  corrected_text TEXT,
  examiner_comment TEXT,
  inline_corrections JSONB,
  error_categories JSONB,
  next_steps JSONB,
  meets_level_requirements JSONB,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de tareas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  correction_id UUID REFERENCES corrections(id),
  title TEXT NOT NULL,
  theory_explanation TEXT NOT NULL,
  exercise_instructions TEXT NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('escritura','completar','transformacion','reescritura')),
  exercise_content JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','started','in_progress','completed')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Tabla de envíos de tareas
CREATE TABLE task_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id),
  content TEXT NOT NULL,
  ai_feedback TEXT,
  ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
  xp_earned INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de historial de progreso
CREATE TABLE progress_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  writing_score INTEGER,
  detected_level TEXT,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES para performance
CREATE INDEX idx_writings_student ON writings(student_id);
CREATE INDEX idx_corrections_writing ON corrections(writing_id);
CREATE INDEX idx_tasks_student ON tasks(student_id, status);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_students_xp ON students(xp_points DESC);
CREATE INDEX idx_progress_student ON progress_history(student_id, date);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_history ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS

-- Profiles: cada uno ve el suyo, admin ve todos
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Students: alumno ve el suyo, profesor ve sus alumnos, admin ve todos
CREATE POLICY "Student view own" ON students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Teacher view students" ON students FOR SELECT USING (
  EXISTS (SELECT 1 FROM teachers WHERE id = auth.uid() AND students.teacher_id = auth.uid())
);
CREATE POLICY "Admin full access students" ON students FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Writings: alumno ve los suyos, profesor ve los de sus alumnos
CREATE POLICY "Student view own writings" ON writings FOR SELECT USING (
  auth.uid() = student_id
);
CREATE POLICY "Student insert writings" ON writings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teacher view student writings" ON writings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students s
    JOIN teachers t ON t.id = s.teacher_id
    WHERE s.id = writings.student_id AND t.id = auth.uid()
  )
);

-- Corrections: misma lógica que writings
CREATE POLICY "Student view own corrections" ON corrections FOR SELECT USING (
  EXISTS (SELECT 1 FROM writings WHERE writings.id = corrections.writing_id AND writings.student_id = auth.uid())
);
CREATE POLICY "Teacher view corrections" ON corrections FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM writings w
    JOIN students s ON s.id = w.student_id
    WHERE w.id = corrections.writing_id AND s.teacher_id = auth.uid()
  )
);

-- Tasks: alumno ve las suyas, profesor ve las que creó
CREATE POLICY "Student view own tasks" ON tasks FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Teacher view own tasks" ON tasks FOR ALL USING (auth.uid() = teacher_id);

-- Notifications: cada uno ve las suyas
CREATE POLICY "User view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Progress history: alumno ve el suyo, profesor ve el de sus alumnos
CREATE POLICY "Student view own progress" ON progress_history FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Teacher view progress" ON progress_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students WHERE id = progress_history.student_id AND teacher_id = auth.uid()
  )
);

-- Function to get student rank and difference from previous week
CREATE OR REPLACE FUNCTION get_student_rank(student_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    current_rank INTEGER;
    prev_rank INTEGER;
    rank_diff INTEGER;
BEGIN
    -- Current rank based on XP
    SELECT rank INTO current_rank
    FROM (
        SELECT id, RANK() OVER (ORDER BY xp_points DESC) as rank
        FROM students
    ) s
    WHERE s.id = student_uuid;

    -- For demo/simplicity, we return a mock diff.
    -- In a real app, you'd compare with a historical snapshots table.
    rank_diff := floor(random() * 3 - 1); -- Randomly -1, 0, or 1

    RETURN jsonb_build_object(
        'rank', COALESCE(current_rank, 0),
        'diff', rank_diff
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
