import { useState, useEffect } from 'react';
import { message } from 'antd';
import { storageService } from '@/services/localStorage';

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  description: string;
  studentCount: number;
  status: 'active' | 'completed' | 'paused';
}

export default () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    setCourses(storageService.getCourses());
    setInstructors(storageService.getInstructors());
  }, []);

  const saveInstructor = (instructor: Partial<Instructor>) => {
    try {
      let newInstructors;
      if (instructor.id) {
        newInstructors = instructors.map(i => 
          i.id === instructor.id ? { ...i, ...instructor } : i
        );
      } else {
        const newInstructor = {
          ...instructor,
          id: Date.now().toString(),
        } as Instructor;
        newInstructors = [...instructors, newInstructor];
      }
      setInstructors(newInstructors);
      storageService.setInstructors(newInstructors);
      return true;
    } catch (error) {
      message.error('Lỗi khi lưu giảng viên');
      return false;
    }
  };

  const saveCourse = (course: Partial<Course>) => {
    try {
      // Validate duplicate course name
      const isDuplicate = courses.some(c => 
        c.name === course.name && c.id !== course.id
      );
      if (isDuplicate) {
        message.error('Tên khóa học đã tồn tại');
        return false;
      }

      let newCourses;
      if (course.id) {
        newCourses = courses.map(c => 
          c.id === course.id ? { ...c, ...course } : c
        );
      } else {
        const newCourse = {
          ...course,
          id: Date.now().toString(),
          studentCount: 0,
        } as Course;
        newCourses = [...courses, newCourse];
      }
      setCourses(newCourses);
      storageService.setCourses(newCourses);
      return true;
    } catch (error) {
      message.error('Lỗi khi lưu khóa học');
      return false;
    }
  };

  const deleteCourse = (id: string) => {
    try {
      const course = courses.find(c => c.id === id);
      if (course?.studentCount && course.studentCount > 0) {
        message.error('Không thể xóa khóa học đã có học viên');
        return false;
      }
      const newCourses = courses.filter(c => c.id !== id);
      setCourses(newCourses);
      storageService.setCourses(newCourses);
      return true;
    } catch (error) {
      message.error('Lỗi khi xóa khóa học');
      return false;
    }
  };

  return {
    courses,
    instructors,
    loading,
    saveInstructor,
    saveCourse,
    deleteCourse,
  };
};