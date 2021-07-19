import { Button, Col, Modal, Row, Select, Tree } from 'antd';
// 添加其他部门
import React, { Component } from 'react';

import { Query } from '@apollo/client/react/components';
import {
  organizations as ALLORGANIZATION,
  orgStructure as ORGSTRUCTURE,
  queryDepartmentInfo as QUERY_DEPARTMENT_INFO,
} from '../gqls/userManage.gql';
import { tree } from '@/pages/WisdomPartyBuilding/utils/utils';

const { TreeNode } = Tree;
const { Option } = Select;

interface IAddOtherEmployeeProps {
  visible: boolean;
  onOk: (data: object[]) => void;
  onCancel: () => void;
  organizationId: string;
  getModalRef: (data: any) => void;
}

export default class AddOtherEmployee extends Component<IAddOtherEmployeeProps> {
  public refetch?: any;

  public state = {
    selectedDepartment: [], // 选中的部门
    outListData: [], // 外面已选的部门
    selectDepartJobs: [], // 选中的部门和职务
  };

  componentDidMount = () => {
    this.props.getModalRef(this);
  };

  public renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} disabled>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      const disabledFlag = this.state.outListData.find(ele => ele.id === item.id);
      return <TreeNode dataRef={item} title={item.name} key={item.id} disabled={disabledFlag} />;
    });

  public handleOnCheck = (checkedKeys, e) => {
    console.log('123', checkedKeys);
    console.log('1234', e);
    const selectedDepartmentTemp = [];
    e.checkedNodes.map(ele => {
      selectedDepartmentTemp.push({
        id: ele.props.dataRef.id,
        name: ele.props.dataRef.name,
      });
    });
    this.setState({
      selectedDepartment: selectedDepartmentTemp,
    });
  };

  // 清空选择数据
  public clearSelectedData = () => {
    this.setState({ selectedDepartment: [] });
  };

  // treedata disabled
  public treeDataIsDisabled = listData => {
    this.setState({ outListData: listData });
  };

  public handleSelect = (value, option, department) => {
    console.log('111', value);
    console.log('111', option);
    console.log('111', department);
    const a = { id: department.id, name: department.name, jobId: option.key, jobName: option.props.children };
    this.setState({
      selectDepartJobs: a,
    });
  };

  render() {
    const { visible, onOk, onCancel, organizationId } = this.props;
    return (
      <div>
        <Modal
          title="请选择其他部门"
          visible={visible}
          onOk={() => onOk(this.state.selectedDepartment)}
          onCancel={onCancel}
          destroyOnClose
          bodyStyle={{ height: 400, overflow: 'auto' }}
        >
          <Query query={ORGSTRUCTURE} variables={{ id: organizationId }}>
            {({ data = {}, loading, error, refetch }) => {
              this.refetch = refetch;
              const { organization = { departments: [] } } = data || [];
              const treeData = tree(organization.departments && organization.departments.map(item => ({ ...item })), {
                idKey: 'id',
                pidKey: 'parent.id',
                childrenKey: 'children',
                converter: (item: any) => item,
              });
              console.log('data', treeData);
              return (
                <Row>
                  <Col span={10} style={{ border: '1px solid #eee' }}>
                    <Tree checkable onCheck={this.handleOnCheck}>
                      {this.renderTreeNodes(treeData)}
                    </Tree>
                  </Col>
                  <Col offset={4} span={10} style={{ border: '1px solid #eee', minHeight: 100 }}>
                    {this.state.selectedDepartment.map(ele => (
                      <Query query={QUERY_DEPARTMENT_INFO} variables={{ id: ele.id }}>
                        {({ data }) => {
                          const { department = { jobs: [] } } = data || {};
                          return (
                            <div style={{ display: 'block' }}>
                              <span>{`${department.name}:`} </span>
                              <Select
                                style={{ width: '100%' }}
                                onSelect={(value, option) => this.handleSelect(value, option, department)}
                              >
                                {department.jobs.map(ele => (
                                  <Option key={ele.id}>{ele.name}</Option>
                                ))}
                              </Select>
                            </div>
                          );
                        }}
                      </Query>
                    ))}
                  </Col>
                </Row>
              );
            }}
          </Query>
        </Modal>
      </div>
    );
  }
}
