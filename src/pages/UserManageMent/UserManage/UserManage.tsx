import * as React from 'react';
import { history as router } from 'umi';
import Organization, { ActionData, ActionType } from '@/pages/Organization/views/Organization';

export default class UserManage extends React.Component<any, any> {
  state = { openKeys: [] };

  handleAction = (type: ActionType, data: ActionData) => {
    console.log(type, data);
    switch (type) {
      case 'changeDepartment':
        router.push({
          pathname: location.pathname,
          query: {
            department: data.department,
          },
        });
        break;
      case 'updateEmployee':
        router.push(`/manage/system/organizations/${data.organization}/employees/${data.employee}/edit`);
        break;
      case 'createEmployee':
        router.push(`/manage/system/organizations/${data.organization}/employees/${data.department}/save`);
        break;
      case 'employeeDetail':
        router.push(`/manage/system/organizations/${data.organization}/employees/userDetail/${data.employee}`);
        break;
      case 'treeOpenKeys':
        this.setState({ openKeys: data.openKeys });
        console.log('openKeys', data.openKeys);
        break;
    }
  };

  render() {
    const { location } = this.props;
    const { department } = location.query || { department: undefined };
    return <Organization organization="1" department={department} eventHandler={this.handleAction} />;
    // const { net } = LibraryManager.getComponents();
    // return <net.whir.hos.demo.DemoTest01 name="xsdfsfds->>" />;
  }
}
