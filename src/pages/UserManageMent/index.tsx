import { ILibrary } from '@asany/components';

export default {
  id: 'orgStructure',
  name: '组织架构user',
  components: [
    // {
    //   id: './UserManageMent/UserManage',
    //   name: '用户管理',
    //   component: UserManage,
    //   configuration: Configuration,
    // },
    // {
    //   id: 'net.whir.hos.user.EmployeeManage',
    //   name: '用户管理',
    //   component: UserManage,
    //   configuration: Configuration,
    // },
    {
      id: './UserManageMent/userManageAdd',
      name: '用户管理新增',
      component: require('./UserManage/UserManageAdd').default,
    },
    // {
    //   id: './UserManageMent/userManageUpdate',
    //   name: '用户管理更新',
    //   component: require('./UserManage/UserManageUpdate').default,
    // },
    {
      id: './UserManageMent/organizationManage',
      name: '组织管理',
      component: require('./organizationManage/organizationManage').default,
    },
    // {
    //   id: 'net.whir.hos.UserManage.UserDetail',
    //   name: '人员详情1',
    //   component: UserDetail,
    // },
    /*     {
      id: './UserManageMent/departmentManage',
      name: '部门管理',
      component: require('./departmentManage/departmentManage').default,
    }, */
  ],
};

