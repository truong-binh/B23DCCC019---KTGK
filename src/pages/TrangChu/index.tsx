import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './components/style.less';
import { unitName } from '@/services/base/constant';
import { useModel } from 'umi';

const TrangChu = () => {
  // Thông tin sinh viên - bạn có thể thay đổi thông tin này
  const studentInfo = {
    name: 'Trương Ái Bình', // Thay tên của bạn
    studentId: 'B23DCCC019', // Thay mã sinh viên của bạn
    avatar: 'https://avatars.githubusercontent.com/u/165627842?v=4', // Thay đường dẫn ảnh của bạn
  };

  return (
    <Card bodyStyle={{ height: '100%' }}>
      <div className='home-welcome'>
        <div className='student-info'>
          <Avatar 
            size={120} 
            icon={<UserOutlined />} 
            src={studentInfo.avatar}
            style={{ marginBottom: '20px' }}
          />
          <h2 className='student-name'>{studentInfo.name}</h2>
          <h3 className='student-id'>MSV: {studentInfo.studentId}</h3>
        </div>
        <h1 className='title'>THỰC HÀNH LẬP TRÌNH WEB</h1>
        <h2 className='sub-title'>{unitName.toUpperCase()}</h2>
      </div>
    </Card>
  );
};

export default TrangChu;