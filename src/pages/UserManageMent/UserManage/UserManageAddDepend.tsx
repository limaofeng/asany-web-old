import { Cascader, Modal, Select, Transfer, message } from 'antd';
import { Form } from '@ant-design/compatible';
import { Mutation, Query } from '@apollo/client/react/components';
import React, { Component } from 'react';

import {
  batchUpdateEmployeePosition as BATCH_UPDATE_EMPLOYEE_POSITION,
  queryDepartments as QUERY_ALL_DEPARTMENTS,
  queryDepartmentInfo as QUERY_DEPARTMENT_INFO,
  getDepartment as QUERY_DEPARTMENT_POSITION,
} from '../gqls/userManage.gql';
import { tree } from '@/pages/WisdomPartyBuilding/utils/utils';

const { Option } = Select;

interface IUserManageAddDependProps {
  wrappedComponentRef: (data: any) => void;
}
@Form.create({ name: 'UserManageAddDepend' })
export default class UserManageAddDepend extends Component<IUserManageAddDependProps> {
  public refetch?: any;

  public state = {
    visible: false,
    value: '',
    departmentId: '1',
    dependId: '',
    organization: '',
    addrganizationId: '',
    targetKeys: [],
    targetDepartmentName: '',
    targetDepartmentId: '',
    selectValue: '',
  };

  // componentDidMount = () => {
  //   this.props.wrappedComponentRef(this);
  // };
  public open = department => {
    console.log('123', department);
    this.setState({
      visible: true,
      // dependId: department.organization.depend.id,
      organization: department.organization && department.organization.id,
      targetDepartmentName: department.name,
      targetDepartmentId: department.id,
    });
  };

  public close = () => {
    this.setState({ visible: false });
  };

  public onSelect = (value, node, extra) => {
    console.log(value);
    console.log(node);
    console.log(extra);
    // this.setState({ value, departmentId: extra.selectedNodes[0].key });
  };

  public onDependSelect = (value, node, extra) => {
    console.log(value, node, extra);
    this.setState({
      departmentId: value[value.length - 1],
    });
  };

  public onOwnSelect = (value, node, extra) => {
    console.log(value, node, extra);
  };

  public handleTransferChange = targetKeys => {
    this.setState({ targetKeys });
  };

  // 保存
  public handleOk = async mutationSubmit => {
    console.log('保存数据', this.state.targetKeys);
    if (this.state.targetKeys.length === 0) {
      message.warn('请先选择用户！');
      return;
    }

    await mutationSubmit({
      variables: {
        employees: this.state.targetKeys,
        position: this.props.form.getFieldValue('position'),
      },
    });
    this.close();
    message.success('新增成功！');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Mutation mutation={BATCH_UPDATE_EMPLOYEE_POSITION}>
          {(mutationSubmit, { data }) => (
            <Modal
              visible={this.state.visible}
              title="新增用户"
              okText="保存"
              onCancel={this.close}
              width={700}
              onOk={() => this.handleOk(mutationSubmit)}
            >
              <h6>请选择部门：</h6>
              <Query query={QUERY_ALL_DEPARTMENTS} variables={{ organization: this.state.organization }}>
                {({ data, loading, refetch }) => {
                  this.refetch = refetch;
                  const { departments = [] } = data || [];
                  // const departmentsTemp = departments.map(item => ({ ...item }));
                  const options = tree(departments && departments.map(item => ({ ...item })), {
                    idKey: 'id',
                    pidKey: 'parent.id',
                    childrenKey: 'children',
                    converter: (item: any) => {
                      item.label = item.name;
                      item.value = item.id;
                      return item;
                    },
                  });
                  return (
                    <Cascader
                      options={options}
                      onChange={this.onDependSelect}
                      placeholder="请选择部门"
                      allowClear
                      style={{ width: 240 }}
                    />
                  );
                }}
              </Query>
              {/* <Query query={QUERY_ALL_DEPARTMENTS} variables={{ organization: this.state.addrganizationId }}>
            {({ data, loading, refetch }) => {
              this.refetch = refetch;
              const { departments = [] } = data || [];
              // const departmentsTemp = departments.map(item => ({ ...item }));
              const options = tree(departments && departments.map(item => ({ ...item })), {
                idKey: 'id',
                pidKey: 'parent.id',
                childrenKey: 'children',
                converter: (item: any) => {
                  item.label = item.name;
                  item.value = item.id;
                  return item;
                },
              });
              return (
                <Cascader
                  options={options}
                  onChange={this.onOwnSelect}
                  placeholder="请选择部门"
                  allowClear={true}
                  style={{ width: 240 }}
                />
              );
            }}
          </Query> */}
              {/* 添加到部门 */}
              <h6 style={{ display: 'inline-block', float: 'right', marginRight: 100 }}>
                添加到部门：{this.state.targetDepartmentName}
              </h6>
              <hr />
              <Query query={QUERY_DEPARTMENT_INFO} variables={{ id: this.state.departmentId }}>
                {({ data, loading, error }) => {
                  console.log('请去部门人员', data);
                  const { department = { employees: [] } } = data || {};
                  const dataSource = [];
                  department &&
                    department.employees.map(ele => {
                      dataSource.push({
                        key: ele.id,
                        title: ele.name,
                      });
                    });
                  return (
                    <Transfer
                      style={{ width: '100%' }}
                      dataSource={dataSource}
                      titles={['依赖组织', '本组织']}
                      render={item => item.title}
                      listStyle={{
                        width: 250,
                        height: 300,
                      }}
                      targetKeys={this.state.targetKeys}
                      onChange={this.handleTransferChange}
                    />
                  );
                }}
              </Query>
              {/* 请求部门职务 */}
              <Query query={QUERY_DEPARTMENT_POSITION} variables={{ id: this.state.targetDepartmentId }}>
                {({ data, loading }) => {
                  if (loading) return null;
                  console.log('职务', data);
                  const { department } = data || {};
                  const { positions = [] } = department || {};
                  return (
                    <Form>
                      <Form.Item label="职务：">
                        {getFieldDecorator('position', {
                          initialValue: positions.length !== 0 ? positions[0].id : '',
                        })(
                          <Select style={{ width: 200, marginTop: 6 }}>
                            {positions.map((ele, index) => (
                              <Option value={ele.id} key={index}>
                                {ele.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Form>
                  );
                }}
              </Query>
            </Modal>
          )}
        </Mutation>
      </div>
    );
  }
}
