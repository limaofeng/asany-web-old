import { Tabs, Tree } from 'antd';
import React from 'react';
import { Query } from '@apollo/client/react/components';
import { QueryResult } from '@apollo/client';
// import { Query, QueryResult } from '@apollo/client/react/components';
import { tree } from '../utils/utils';

import {
  departments as DEPARTMENTS,
  employeeGroups as EMPLOYEE_GROUPS,
  queryRoles as QUERY_ROLES,
} from './gqls/employee.gql';

const { TreeNode } = Tree;
const { TabPane } = Tabs;

export interface SelectItemValue {
  id: string;
  name: string;
}

export interface Department extends SelectItemValue {}

export interface EmployeeGroup {}

export type SelectItemType = 'DEPARTMENT' | 'EMPLOYEEGROUP' | 'EMPLOYEE' | 'ROLE' | 'ORGANIZATION';
export interface SelectItem {
  key: string;
  type: SelectItemType;
  value: SelectItemValue;
}

interface SecurityScopeTreeProps {
  organization: string;
  selectedKeys?: string[];
  onClick?: (value?: SelectItem) => void;
  onSelect?: (type: SelectItemType, items: SelectItem[]) => void;
}

interface SecurityScopeTreeState {}

class SecurityScopeTree extends React.Component<SecurityScopeTreeProps, SecurityScopeTreeState> {
  static defaultProps = {
    selectedKeys: [],
  };

  renderEmployeeGroupTree = ({ data }: QueryResult) => {
    const { selectedKeys } = this.props;
    let { employeeGroups = [] } = data || [];
    employeeGroups = employeeGroups.map((item: any) => ({ ...item, key: `EMPLOYEEGROUP_${item.id}` }));
    console.log(employeeGroups, 'employeeGroups');
    return (
      <div style={{ height: 350, overflow: 'auto' }}>
        <Tree
          checkable
          onCheck={this.handleCheck(employeeGroups, 'EMPLOYEEGROUP')}
          checkedKeys={selectedKeys!.filter(item => item.startsWith('EMPLOYEEGROUP_'))}
          onSelect={this.handleSelect(employeeGroups, 'EMPLOYEEGROUP')}
        >
          {this.renderTreeNodes(employeeGroups)}
        </Tree>
      </div>
    );
  };

  // 查询角色
  renderActionTree = ({ data }: QueryResult) => {
    const { selectedKeys } = this.props;
    let { roles = [] } = data || {};
    roles = roles.map((item: any) => ({ ...item, key: `ROLE_${item.id}` }));
    console.log(roles, 'roles');
    return (
      <div style={{ height: 350, overflow: 'auto' }}>
        <Tree
          checkable
          onCheck={this.handleCheck(roles, 'ROLE')}
          checkedKeys={selectedKeys!.filter(item => item.startsWith('ROLE_'))}
          onSelect={this.handleSelect(roles, 'ROLE')}
        >
          {this.renderTreeNodes(roles)}
        </Tree>
      </div>
    );
  };

  renderTreeNodes = (treeData: any) =>
    treeData.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.key} dataRef={item} />;
    });

  // 选中群组
  handleCheck = (all: any[], type: SelectItemType) => (selectedKeys: any, e: any) => {
    const { onSelect } = this.props;
    if (!onSelect) {
      return;
    }
    console.log('handleCheck', type, selectedKeys, e);
    const selectedItems = selectedKeys.map((key: string) => {
      const { children, ...data } = all.find(item => item.key === key);
      return data;
    });
    const items: any[] = tree(selectedItems, {
      idKey: 'id',
      pidKey: 'parent.id',
      childrenKey: 'children',
      converter: (data: any) => ({ ...data }),
    });
    onSelect(
      type,
      items.map(item => ({
        key: item.key,
        type,
        value: item,
      }))
    );
  };

  /**
   * 树形选择的回调
   */
  handleSelect = (all: any[], type: SelectItemType) => (selectedKeys: string[], info: any) => {
    const { onClick } = this.props;
    if (!onClick) {
      return;
    }
    const value = selectedKeys.map(key => all.find(item => item.key === key))[0];
    onClick({
      key: value.key,
      type,
      value,
    });
  };

  handleAllEmployee = () => {
    const { onClick } = this.props;
    if (!onClick) {
      return;
    }
    onClick(undefined);
  };

  /**
   * 组织部门树
   */
  renderDepartmentTree = ({ data }: QueryResult) => {
    const { selectedKeys } = this.props;
    let { departments = [] } = data || {};
    departments = departments.map((item: any) => ({ ...item, key: `DEPARTMENT_${item.id}` }));
    const departmentTree = tree(departments, {
      idKey: 'id',
      pidKey: 'parent.id',
      childrenKey: 'children',
      converter: (data: any) => ({ ...data }),
    });
    return (
      <div style={{ height: 350, overflow: 'auto' }}>
        <Tree
          checkable
          onCheck={this.handleCheck(departments, 'DEPARTMENT')}
          checkedKeys={selectedKeys!.filter(item => item.startsWith('DEPARTMENT_'))}
          onSelect={this.handleSelect(departments, 'DEPARTMENT')}
        >
          {this.renderTreeNodes(departmentTree)}
        </Tree>
      </div>
    );
  };

  render() {
    const { organization } = this.props;
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="组织" key="1">
            {/* 4；组织树形结构 ；组织 */}
            <a onClick={this.handleAllEmployee}>全部组织</a>
            <Query query={DEPARTMENTS} variables={{ organization }}>
              {this.renderDepartmentTree}
            </Query>
          </TabPane>
          <TabPane tab="群组" key="2">
            {/* 4；组织树形结构 全部群组 */}
            全部群组
            <Query query={EMPLOYEE_GROUPS} variables={{ scope: 'GD' }}>
              {this.renderEmployeeGroupTree}
            </Query>
          </TabPane>
          <TabPane tab="角色" key="3">
            {/* 4；组织树形结构 ；全部角色 */}
            全部角色
            <Query query={QUERY_ROLES} variables={{ organization }}>
              {this.renderActionTree}
            </Query>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default SecurityScopeTree;
