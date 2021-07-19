/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EmployeeFilter, EmployeeStatus, Sex } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL query operation: organizationSelect
// ====================================================

export interface organizationSelect_organization_employees_edges_node_departments {
  __typename: 'Department';
  /**
   * 部门名称
   */
  name: string | null;
}

export interface organizationSelect_organization_employees_edges_node {
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
  departments: (organizationSelect_organization_employees_edges_node_departments | null)[] | null;
}

export interface organizationSelect_organization_employees_edges {
  __typename: 'EmployeeEdge';
  node: organizationSelect_organization_employees_edges_node | null;
}

export interface organizationSelect_organization_employees {
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
  edges: (organizationSelect_organization_employees_edges | null)[] | null;
}

export interface organizationSelect_organization {
  __typename: 'Organization';
  /**
   * 组织员工
   */
  employees: organizationSelect_organization_employees | null;
}

export interface organizationSelect {
  /**
   * 组织•单个组织
   */
  organization: organizationSelect_organization | null;
}

export interface organizationSelectVariables {
  id: string;
  page?: number | null;
  pageSize?: number | null;
  orderBy?: any | null;
  filter?: EmployeeFilter | null;
}
