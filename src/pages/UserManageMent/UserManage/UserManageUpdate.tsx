import React, { Component } from 'react';

import { Card } from 'antd';
import { Query } from '@apollo/client/react/components';
import { PageContainer } from '@asany/components';
import EmployeeFormSave from './UserManageAddForm';
import { employee as QUERY_SINGLE_EMPLOYEE } from '../gqls/userManage.gql';
import { QueryResult,MutationResult } from '@apollo/client';
export default class UserManageUpdate extends Component<any, any> {
  render() {
    console.log('props1', this.props);
    const { match, location } = this.props;
    // const{ organization } = location.query;
    const { id, organization, department } = match.params;
    console.log('location.query', organization, department);
    return (
      <PageContainer title="用户管理编辑1112">
        <Card>
          {id ? (
            <Query
              query={QUERY_SINGLE_EMPLOYEE}
              variables={{ id: id && id, organization: organization && organization }}
            >
              {this.renderEmployee}
            </Query>
          ) : (
            <EmployeeFormSave organization={organization} department={department} />
          )}
        </Card>
      </PageContainer>
    );
  }

  renderEmployee = ({ data, loading }: QueryResult) => {
    const { employee = {}, organization = {} } = data || {};
    console.log(data);

    if (loading) return null;
    return <EmployeeFormSave employee={employee} organization={organization} />;
  };
}
