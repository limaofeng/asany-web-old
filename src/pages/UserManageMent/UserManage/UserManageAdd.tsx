import React, { Component } from 'react';

import { Card } from 'antd';
import { Query } from '@apollo/client/react/components';
import { PageContainer } from '@asany/components';
import { EmployeeFormCreate } from './UserManageAddForm';
import { getDepartment as QUERYDEPARTMENTINFO } from '../gqls/userManage.gql';

export default class UsermanageMentAdd extends Component<any, any> {
  render() {
    console.log('props-------', this.props);
    const { location, application } = this.props;
    const { organization } = application || {};
    const { department: departmentId } = location.query || { department: undefined };
    return (
      <PageContainer title="用户管理新增2222">
        <Card>
          <Query query={QUERYDEPARTMENTINFO} variables={{ id: departmentId }}>
            {({ data }) => {
              const { department = { id: departmentId } } = data || { department: { id: departmentId } };
              return <EmployeeFormCreate department={department} organization={organization} />;
            }}
          </Query>
        </Card>
      </PageContainer>
    );
  }
}
