export interface Subject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: number; // Thời lượng học (phút)
  content: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyGoal {
  id: string;
  month: string; // Format: YYYY-MM
  subjectId?: string; // Nếu null thì là mục tiêu tổng
  targetHours: number;
  createdAt: string;
  updatedAt: string;
}
