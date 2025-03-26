import { Subject, StudySession, MonthlyGoal } from '@/types/study';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const STORAGE_KEYS = {
  SUBJECTS: 'study_subjects',
  SESSIONS: 'study_sessions',
  GOALS: 'study_goals',
};

// Helpers
const getStorageItem = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorageItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Subjects CRUD
export const getSubjects = (): Subject[] => {
  return getStorageItem(STORAGE_KEYS.SUBJECTS);
};

export const addSubject = (name: string): Subject => {
  const subjects = getSubjects();
  const newSubject: Subject = {
    id: uuidv4(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  subjects.push(newSubject);
  setStorageItem(STORAGE_KEYS.SUBJECTS, subjects);
  return newSubject;
};

export const updateSubject = (id: string, name: string): Subject | null => {
  const subjects = getSubjects();
  const index = subjects.findIndex((s: Subject) => s.id === id);
  if (index === -1) return null;
  
  subjects[index] = {
    ...subjects[index],
    name,
    updatedAt: new Date().toISOString(),
  };
  setStorageItem(STORAGE_KEYS.SUBJECTS, subjects);
  return subjects[index];
};

export const deleteSubject = (id: string): boolean => {
  const subjects = getSubjects();
  const filtered = subjects.filter((s: Subject) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SUBJECTS, filtered);
  
  // Xóa các sessions và goals liên quan
  const sessions = getSessions();
  const filteredSessions = sessions.filter((s: StudySession) => s.subjectId !== id);
  setStorageItem(STORAGE_KEYS.SESSIONS, filteredSessions);
  
  const goals = getGoals();
  const filteredGoals = goals.filter((g: MonthlyGoal) => g.subjectId !== id);
  setStorageItem(STORAGE_KEYS.GOALS, filteredGoals);
  
  return true;
};

// Study Sessions CRUD
export const getSessions = (): StudySession[] => {
  return getStorageItem(STORAGE_KEYS.SESSIONS);
};

export const addSession = (session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>): StudySession => {
  const sessions = getSessions();
  const newSession: StudySession = {
    ...session,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  setStorageItem(STORAGE_KEYS.SESSIONS, sessions);
  return newSession;
};

export const updateSession = (
  id: string,
  sessionData: Partial<Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>>,
): StudySession | null => {
  const sessions = getSessions();
  const index = sessions.findIndex((s: StudySession) => s.id === id);
  if (index === -1) return null;
  
  sessions[index] = {
    ...sessions[index],
    ...sessionData,
    updatedAt: new Date().toISOString(),
  };
  setStorageItem(STORAGE_KEYS.SESSIONS, sessions);
  return sessions[index];
};

export const deleteSession = (id: string): boolean => {
  const sessions = getSessions();
  const filtered = sessions.filter((s: StudySession) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SESSIONS, filtered);
  return true;
};

// Monthly Goals CRUD
export const getGoals = (): MonthlyGoal[] => {
  return getStorageItem(STORAGE_KEYS.GOALS);
};

export const addGoal = (goal: Omit<MonthlyGoal, 'id' | 'createdAt' | 'updatedAt'>): MonthlyGoal => {
  const goals = getGoals();
  const newGoal: MonthlyGoal = {
    ...goal,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  goals.push(newGoal);
  setStorageItem(STORAGE_KEYS.GOALS, goals);
  return newGoal;
};

export const updateGoal = (
  id: string,
  goalData: Partial<Omit<MonthlyGoal, 'id' | 'createdAt' | 'updatedAt'>>,
): MonthlyGoal | null => {
  const goals = getGoals();
  const index = goals.findIndex((g: MonthlyGoal) => g.id === id);
  if (index === -1) return null;
  
  goals[index] = {
    ...goals[index],
    ...goalData,
    updatedAt: new Date().toISOString(),
  };
  setStorageItem(STORAGE_KEYS.GOALS, goals);
  return goals[index];
};

export const deleteGoal = (id: string): boolean => {
  const goals = getGoals();
  const filtered = goals.filter((g: MonthlyGoal) => g.id !== id);
  setStorageItem(STORAGE_KEYS.GOALS, filtered);
  return true;
};

// Helpers
export const calculateProgress = (subjectId: string | undefined, month: string): number => {
  const sessions = getSessions();
  const goals = getGoals();
  
  // Lọc các sessions trong tháng được chọn
  const monthSessions = sessions.filter((session) => {
    // Chỉ lấy sessions trong tháng đó
    const sessionMonth = moment(session.date).format('YYYY-MM');
    
    if (subjectId) {
      // Nếu là mục tiêu cho môn học cụ thể
      return sessionMonth === month && session.subjectId === subjectId;
    } else {
      // Nếu là mục tiêu tổng
      return sessionMonth === month;
    }
  });
  
  // Tính tổng thời gian học
  const totalMinutes = monthSessions.reduce((sum, session) => sum + session.duration, 0);
  
  // Tìm mục tiêu
  const goal = goals.find(
    (g: MonthlyGoal) => g.month === month && g.subjectId === subjectId
  );
  
  if (!goal) return 0;
  
  // Tính phần trăm hoàn thành
  return Math.min(100, (totalMinutes / (goal.targetHours * 60)) * 100);
};