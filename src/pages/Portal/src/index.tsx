import './Icon';
import Portal, { PortalId } from './Portal';
import StudyRankers from './Curriculum/StudyRankers';
import CurriculumCategories from './Curriculum/CurriculumCategories';
import TodoList from './Curriculum/TodoList';
import TopCurriculum from './Curriculum/TopCurriculum';
import MeetingCalendar from './Meeting/MeetingCalendar';
import MeetingTodoList from './Meeting/MeetingTodoList';
import MeetingSchedule from './Meeting/MeetingSchedule';
import MyMeeting from './Meeting/MyMeeting';
import MeetingEffectivenessStatistics from './Meeting/MeetingEffectivenessStatistics';
import MeetingAnalysis from './Meeting/MeetingAnalysis';
import OrganizationCategories from './System/OrganizationCategories';
import DocumentCategories from './System/DocumentCategories';
import MySupervisions from './Supervisions/MySupervisions';
import SupervisionTasks from './Supervisions/SupervisionTasks';
import SupervisionInstruction from './Supervisions/SupervisionInstruction';
import TaskDashboard from './Supervisions/TaskDashboard';
import TaskFollowing from './Supervisions/TaskFollowing';
import TaskStatus from './Supervisions/TaskStatus';
import MeetingManagement from './Policy/MeetingManagement';
import MyThesis from './Policy/MyThesis';
import RecentThesis from './Policy/RecentThesis';
import ThesisCategoriesStatistics from './Policy/ThesisCategoriesStatistics';
import ThesisAnalysisStatistics from './Policy/ThesisAnalysisStatistics';
import DocumentFile from './File/DocumentFile';
import MyBorrow from './File/MyBorrow';
import FileDisposition from './File/FileDisposition';
import FileCategories from './File/FileCategories';
import FileSource from './File/FileSource';
import FileRank from './File/FileRank';
import VehicleManagement from './Vehicle/VehicleManagement';
import VehicleStatus from './Vehicle/VehicleStatus';
import VehicleStatistics from './Vehicle/VehicleStatistics';
import QuestionnaireManagement from './Questionnaire/QuestionnaireManagement';
import QuestionnaireRank from './Questionnaire/QuestionnaireRank';
import MyQuestionnaire from './Questionnaire/MyQuestionnaire';
import QuestionnaireStatistics from './Questionnaire/QuestionnaireStatistics';
import QuestionnaireAnalysis from './Questionnaire/QuestionnaireAnalysis';
import AIService from './AIService';
import BBSCategories from './BBS/BBSCategories';
import BBSTops from './BBS/BBSTops';

export default {
  id: 'portal',
  name: '门户',
  components: [
    {
      id: PortalId,
      name: '基础门户',
      component: Portal,
    },
    {
      id: 'com.thuni.his.common.StudyRankers',
      name: '学习达人',
      tags: ['门户/部件/学习考试'],
      component: StudyRankers,
    },
    {
      id: 'com.thuni.his.common.CurriculumCategories',
      name: '课程目录',
      tags: ['门户/部件/学习考试'],
      component: CurriculumCategories,
    },
    {
      id: 'com.thuni.his.common.TodoList',
      name: '待办事项',
      tags: ['门户/部件/学习考试'],
      component: TodoList,
    },
    {
      id: 'com.thuni.his.common.TopCurriculum',
      name: '推荐课程',
      tags: ['门户/部件/学习考试'],
      component: TopCurriculum,
    },
    {
      id: 'com.thuni.his.common.MeetingCalendar',
      name: '会议日历',
      tags: ['门户/部件/会议'],
      component: MeetingCalendar,
    },
    {
      id: 'com.thuni.his.common.MeetingTodoList',
      name: '会议待办',
      tags: ['门户/部件/会议'],
      component: MeetingTodoList,
    },
    {
      id: 'com.thuni.his.common.MeetingSchedule',
      name: '待参加的会议',
      tags: ['门户/部件/会议'],
      component: MeetingSchedule,
    },
    {
      id: 'com.thuni.his.common.MyMeeting',
      name: '我的会议',
      tags: ['门户/部件/会议'],
      component: MyMeeting,
    },
    {
      id: 'com.thuni.his.common.MeetingEffectivenessStatistics',
      name: '会议效率统计',
      tags: ['门户/部件/会议'],
      component: MeetingEffectivenessStatistics,
    },
    {
      id: 'com.thuni.his.common.MeetingAnalysis',
      name: '会议类型分析',
      tags: ['门户/部件/会议'],
      component: MeetingAnalysis,
    },
    {
      id: 'com.thuni.his.common.OrganizationCategories',
      name: '组织类目',
      tags: ['门户/部件/制度'],
      component: OrganizationCategories,
    },
    {
      id: 'com.thuni.his.common.DocumentCategories',
      name: '文件层级类目',
      tags: ['门户/部件/制度'],
      component: DocumentCategories,
    },
    {
      id: 'com.thuni.his.common.MySupervisions',
      name: '我的督办',
      tags: ['门户/部件/督查督办'],
      component: MySupervisions,
    },
    {
      id: 'com.thuni.his.common.SupervisionTasks',
      name: '督办任务',
      tags: ['门户/部件/督查督办'],
      component: SupervisionTasks,
    },
    {
      id: 'com.thuni.his.common.SupervisionInstruction',
      name: '领导指示',
      tags: ['门户/部件/督查督办'],
      component: SupervisionInstruction,
    },
    {
      id: 'com.thuni.his.common.TaskDashboard',
      name: '任务工作台',
      tags: ['门户/部件/督查督办'],
      component: TaskDashboard,
    },
    {
      id: 'com.thuni.his.common.TaskFollowing',
      name: '任务督办推进',
      tags: ['门户/部件/督查督办'],
      component: TaskFollowing,
    },
    {
      id: 'com.thuni.his.common.TaskStatus',
      name: '任务执行情况',
      tags: ['门户/部件/督查督办'],
      component: TaskStatus,
    },
    {
      id: 'com.thuni.his.common.MeetingManagement',
      name: '会议管理',
      tags: ['门户/部件/决策管理'],
      component: MeetingManagement,
    },
    {
      id: 'com.thuni.his.common.MyThesis',
      name: '我的议题',
      tags: ['门户/部件/决策管理'],
      component: MyThesis,
    },
    {
      id: 'com.thuni.his.common.ThesisCategoriesStatistics',
      name: '议题分类统计',
      tags: ['门户/部件/决策管理'],
      component: ThesisCategoriesStatistics,
    },
    {
      id: 'com.thuni.his.common.RecentThesis',
      name: '近期议题',
      tags: ['门户/部件/决策管理'],
      component: RecentThesis,
    },
    {
      id: 'com.thuni.his.common.ThesisAnalysisStatistics',
      name: '议题统计分析',
      tags: ['门户/部件/决策管理'],
      component: ThesisAnalysisStatistics,
    },
    {
      id: 'com.thuni.his.common.DocumentFile',
      name: '文件归档',
      tags: ['门户/部件/档案管理'],
      component: DocumentFile,
    },
    {
      id: 'com.thuni.his.common.MyBorrow',
      name: '我的借阅',
      tags: ['门户/部件/档案管理'],
      component: MyBorrow,
    },
    {
      id: 'com.thuni.his.common.FileDisposition',
      name: '档案处置',
      tags: ['门户/部件/档案管理'],
      component: FileDisposition,
    },
    {
      id: 'com.thuni.his.common.FileCategories',
      name: '档案门类',
      tags: ['门户/部件/档案管理'],
      component: FileCategories,
    },
    {
      id: 'com.thuni.his.common.FileSource',
      name: '档案来源',
      tags: ['门户/部件/档案管理'],
      component: FileSource,
    },
    {
      id: 'com.thuni.his.common.FileRank',
      name: '档案排行榜',
      tags: ['门户/部件/档案管理'],
      component: FileRank,
    },
    {
      id: 'com.thuni.his.common.VehicleManagement',
      name: '用车管理',
      tags: ['门户/部件/车辆系统'],
      component: VehicleManagement,
    },
    {
      id: 'com.thuni.his.common.VehicleStatus',
      name: '出车动态',
      tags: ['门户/部件/车辆系统'],
      component: VehicleStatus,
    },
    {
      id: 'com.thuni.his.common.VehicleStatistics',
      name: '统计分析',
      tags: ['门户/部件/车辆系统'],
      component: VehicleStatistics,
    },
    {
      id: 'com.thuni.his.common.QuestionnaireManagement',
      name: '问卷管理',
      tags: ['门户/部件/问卷系统'],
      component: QuestionnaireManagement,
    },
    {
      id: 'com.thuni.his.common.QuestionnaireRank',
      name: '排行榜',
      tags: ['门户/部件/问卷系统'],
      component: QuestionnaireRank,
    },
    {
      id: 'com.thuni.his.common.MyQuestionnaire',
      name: '要我填写的问卷',
      tags: ['门户/部件/问卷系统'],
      component: MyQuestionnaire,
    },
    {
      id: 'com.thuni.his.common.QuestionnaireStatistics',
      name: '统计分析',
      tags: ['门户/部件/问卷系统'],
      component: QuestionnaireStatistics,
    },
    {
      id: 'com.thuni.his.common.QuestionnaireAnalysis',
      name: '问卷类型分析',
      tags: ['门户/部件/问卷系统'],
      component: QuestionnaireAnalysis,
    },
    {
      id: 'com.thuni.his.common.AIService',
      name: '对话机器人悬浮组件',
      tags: ['门户/部件/智能问答'],
      component: AIService,
    },
    {
      id: 'com.thuni.his.common.BBSCategories',
      name: '类目',
      tags: ['门户/部件/论坛'],
      component: BBSCategories,
    },
    {
      id: 'com.thuni.his.common.BBSTops',
      name: '热帖',
      tags: ['门户/部件/论坛'],
      component: BBSTops,
    },
  ],
};
