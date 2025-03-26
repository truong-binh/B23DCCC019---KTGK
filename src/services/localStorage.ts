const COURSES_KEY = 'courses';
const INSTRUCTORS_KEY = 'instructors';

export const getStorageItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const setStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const storageService = {
  getCourses: () => getStorageItem(COURSES_KEY) || [],
  setCourses: (courses: any[]) => setStorageItem(COURSES_KEY, courses),
  getInstructors: () => getStorageItem(INSTRUCTORS_KEY) || [],
  setInstructors: (instructors: any[]) => setStorageItem(INSTRUCTORS_KEY, instructors),
};