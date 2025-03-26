import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, Space, Input, Select, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import CourseForm from '@/components/CourseForm';
import InstructorForm from '@/components/InstructorForm';
import type { Course, Instructor } from '@/models/courseModel';

const CoursePage: React.FC = () => {
  const { courses, instructors, saveCourse, saveInstructor, deleteCourse } = useModel('courseModel');
  const [courseFormVisible, setCourseFormVisible] = useState(false);
  const [instructorFormVisible, setInstructorFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Partial<Course | Instructor> | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleSaveCourse = async (values: Partial<Course>) => {
    if (saveCourse(values)) {
      message.success('Lưu khóa học thành công');
      setCourseFormVisible(false);
      setSelectedRecord(null);
    }
  };

  const handleSaveInstructor = (values: Partial<Instructor>) => {
    if (saveInstructor(values)) {
      message.success('Lưu giảng viên thành công');
      setInstructorFormVisible(false);
      setSelectedRecord(null);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa khóa học này?',
      onOk: () => {
        if (deleteCourse(id)) {
          message.success('Xóa khóa học thành công');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      sorter: (a: Course, b: Course) => a.name.localeCompare(b.name),
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
    },
    {
      title: 'Số học viên',
      dataIndex: 'studentCount',
      sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const statusMap = {
          active: 'Đang mở',
          completed: 'Đã kết thúc',
          paused: 'Tạm dừng',
        };
        return statusMap[status] || status;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Course) => (
        <Space>
          <Button 
            type="link"
            onClick={() => {
              setSelectedRecord(record);
              setCourseFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const filteredCourses = courses
    .filter(course => course.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter(course => !filterInstructor || course.instructor === filterInstructor)
    .filter(course => !filterStatus || course.status === filterStatus);

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedRecord(null);
              setCourseFormVisible(true);
            }}
          >
            Thêm khóa học
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(null);
              setInstructorFormVisible(true);
            }}
          >
            Thêm giảng viên
          </Button>
        </Space>

        <Space>
          <Input.Search
            placeholder="Tìm kiếm khóa học"
            allowClear
            onSearch={value => setSearchText(value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo giảng viên"
            allowClear
            style={{ width: 200 }}
            onChange={value => setFilterInstructor(value)}
          >
            {instructors.map(i => (
              <Select.Option key={i.id} value={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 200 }}
            onChange={value => setFilterStatus(value)}
          >
            <Select.Option value="active">Đang mở</Select.Option>
            <Select.Option value="completed">Đã kết thúc</Select.Option>
            <Select.Option value="paused">Tạm dừng</Select.Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
        />

        <CourseForm
          visible={courseFormVisible}
          course={selectedRecord as Course}
          instructors={instructors}
          onCancel={() => {
            setCourseFormVisible(false);
            setSelectedRecord(null);
          }}
          onSubmit={handleSaveCourse}
        />

        <InstructorForm
          visible={instructorFormVisible}
          instructor={selectedRecord as Instructor}
          onCancel={() => {
            setInstructorFormVisible(false);
            setSelectedRecord(null);
          }}
          onSubmit={handleSaveInstructor}
        />
      </Space>
    </PageContainer>
  );
};

export default CoursePage;