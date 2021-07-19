// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryResult } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Query, Mutation } from '@apollo/client/react/components';
import React from 'react';
import {Select, Space} from 'antd';
import { OrganizationFormModal } from '../organizationManage/organizationManage';
import { createOrg as CREATE_ORG, getOrgs as GET_ORGS } from '../gqls/organizationManage.gql';

interface OrganizationSelectProps {
  onSelect: (value: any) => void;
}

class OrganizationSelect extends React.Component<OrganizationSelectProps, any> {
  modal = React.createRef<OrganizationFormModal>();

  constructor(props: OrganizationSelectProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <Mutation mutation={CREATE_ORG}>{this.renderConnectOrganization}</Mutation>;
  }

  renderConnectOrganization = () => (
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
      <Space>
        <Select allowClear style={{ width: 200 }} value={value} onChange={this.handleChange(organizations)}>
          {organizations.map((ele: any) => (
            <Select.Option key={ele.id} value={ele.id}>
              {ele.name} ({ele.id})
            </Select.Option>
          ))}
        </Select>
        <a onClick={this.handleOpenModal}>创建新的组织</a>
        <OrganizationFormModal ref={this.modal} onSuccess={this.handleSave(refetch)} />
      </Space>
    );
  };
}

export default OrganizationSelect;
