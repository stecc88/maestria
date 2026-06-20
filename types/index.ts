export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type ItalianLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ExerciseType = 'scrittura' | 'completamento' | 'trasformazione' | 'riscrittura';
export type TaskStatus = 'pending' | 'started' | 'in_progress' | 'completed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  status: UserStatus;
  rejection_reason?: string;
  created_at: string;
  last_login?: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  teacher_code: string;
  bio?: string;
  institution?: string;
  approved_at?: string;
}

export interface Student {
  id: string;
  teacher_id?: string;
  teacher_code_used?: string;
  target_level: ItalianLevel;
  current_level?: ItalianLevel;
  xp_points: number;
  streak_days: number;
  last_activity?: string;
}

export interface Writing {
  id: string;
  student_id: string;
  title?: string;
  content: string;
  writing_type: string;
  target_level: ItalianLevel;
  word_count?: number;
  submitted_at: string;
}

export interface Correction {
  id: string;
  writing_id: string;
  detected_level?: ItalianLevel;
  overall_score?: number;
  exam_compliant?: boolean;
  score_coherence?: number;
  score_vocabulary?: number;
  score_grammar?: number;
  score_task_completion?: number;
  pros?: any;
  cons?: any;
  suggestions?: any;
  corrected_text?: string;
  examiner_comment?: string;
  inline_corrections?: any;
  error_categories?: any;
  next_steps?: any;
  meets_level_requirements?: any;
  xp_earned: number;
  created_at: string;
}

export interface Task {
  id: string;
  student_id: string;
  teacher_id: string;
  correction_id?: string;
  title: string;
  theory_explanation: string;
  exercise_instructions: string;
  exercise_type: ExerciseType;
  exercise_content?: any;
  status: TaskStatus;
  due_date?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}
