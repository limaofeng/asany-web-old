import { Mutation, Query } from '@apollo/client/react/components';

import React from 'react';
import { Select } from 'antd';
import { OrganizationFormModal } from '@/pages/UserManageMent/organizationManage/organizationManage';
import { createOrg as CREATE_ORG, getOrgs as GET_ORGS } from '@/pages/UserManageMent/gqls/organizationManage.gql';
import { QueryResult,MutationResult } from '@apollo/client';
interface OrganizationSelectProps {
  onSelect: (value: any) => void;
}

class OrganizationSelect extends React.Component<OrganizationSelectProps, any> {
  modal = React.createRef<OrganizationFormModal>();

  constructor(props: OrganizationSelectProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    return <Mutation mutation={CREATE_ORG}>{this.randerConnectOrganization}</Mutation>;
  }

  randerConnectOrganization = (handleOrg: any, { data = {} }: MutationResult) => (
    <Query query={GET_ORGS}>{this.renderSelect}</Query>
  );

  handleOpenModal = () => {
    this.modal.current!.open();
  };

  handleSave = (refetch: any) => async (data: any) => {
    await refetch();
    this.setState({ value: data.id }, () => {
      this.props.onSelect(data);
    });
  };

  handleChange = (organizations: any[]) => (value: any) => {
    this.setState({ value }, () => {
      this.props.onSelect(organizations.find(item => item.id === value));
    });
  };

  renderSelect = ({ data, refetch }: QueryResult) => {
    const { organizations = [] } = data || [];
    const { value } = this.state;
    return (
      <div>
        <Select allowClear style={{ width: 200 }} value={value} onChange={this.handleChange(organizations)}>
          {organizations.map((ele: any) => (
            <Select.Option key={ele.id} value={ele.id}>
              {ele.name} ({ele.id})
            </Select.Option>
          ))}
        </Select>
        <a onClick={this.handleOpenModal}>创建新的组织</a>
        <OrganizationFormModal ref={this.modal} onSuccess={this.handleSave(refetch)} />
      </div>
    );
  };
}

export default OrganizationSelect;
