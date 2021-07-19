/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EmployeeFilter, EmployeeStatus, Sex } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL query operation: employees
// ====================================================

export interface employees_employees_edges_node_departments_parents {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface employees_employees_edges_node_departments {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
  /**
   * 部门全称 格式如: 销售管理中心.售前支持
   */
  fullName: string | null;
  /**
   * 包含所有父级节点的ID
   */
  path: string | null;
  /**
   * 所有父级部门的集合
   */
  parents: (employees_employees_edges_node_departments_parents | null)[] | null;
}

export interface employees_employees_edges_node {
  __typename: 'Employee';
  id: string | null;
  /**
   * 状态
   */
  status: EmployeeStatus | null;
  /**
   * 名称
   */
  name: string | null;
  /**
   * 工号
   */
  jobNumber: string | null;
  /**
   * 生日
   */
  birthday: string | null;
  /**
   * 性别
   */
  sex: Sex | null;
  /**
   * 移动电话
   */
  mobile: string | null;
  /**
   * 固定电话
   */
  tel: string | null;
  /**
   * E-mail
   */
  email: string | null;
  /**
   * 所属部门
   */
  departments: (employees_employees_edges_node_departments | null)[] | null;
}

export interface employees_employees_edges {
  __typename: 'EmployeeEdge';
  node: employees_employees_edges_node | null;
}

export interface employees_employees {
  __typename: 'EmployeeConnection';
  /**
   * 总数据条数
   */
  total: number | null;
  /**
   * 每页显示条数
   */
  pageSize: number | null;
  /**
   * 当前页
   */
  current: number | null;
  edges: (employees_employees_edges | null)[] | null;
}

export interface employees {
  /**
   * 员工分页查询
   */
  employees: employees_employees | null;
}

export interface employeesVariables {
  organization: string;
  page?: number | null;
  pageSize?: number | null;
  orderBy?: any | null;
  filter?: EmployeeFilter | null;
}
