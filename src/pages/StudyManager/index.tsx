import { Card, Tabs } from 'antd';
import SubjectList from './components/SubjectList';
import StudySessions from './components/StudySessions';
import MonthlyGoals from './components/MonthlyGoals';
import './style.less';

const { TabPane } = Tabs;

const StudyManager: React.FC = () => {
  return (
    <Card>
      <Tabs defaultActiveKey="subjects">
        <TabPane tab="Danh mục môn học" key="subjects">
          <SubjectList />
        </TabPane>
        <TabPane tab="Tiến độ học tập" key="sessions">
          <StudySessions />
        </TabPane>
        <TabPane tab="Mục tiêu tháng" key="goals">
          <MonthlyGoals />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default StudyManager;