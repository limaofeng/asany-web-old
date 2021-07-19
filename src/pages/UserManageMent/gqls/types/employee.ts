/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EmployeeStatus, Sex } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL query operation: employee
// ====================================================

export interface employee_organization {
  __typename: 'Organization';
  id: string | null;
  name: string | null;
}

export interface employee_employee_positions_department {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface employee_employee_positions {
  __typename: 'Position';
  /**
   * 职位
   */
  id: string | null;
  /**
   * 职位名称
   */
  name: string | null;
  /**
   * 所属部门
   */
  department: employee_employee_positions_department | null;
}

export interface employee_employee_primaryPosition {
  __typename: 'Position';
  /**
   * 职位
   */
  id: string | null;
  /**
   * 职位名称
   */
  name: string | null;
}

export interface employee_employee_primaryDepartment_organization {
  __typename: 'Organization';
  id: string | null;
  name: string | null;
}

export interface employee_employee_primaryDepartment {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
  /**
   * 组织机构
   */
  organization: employee_employee_primaryDepartment_organization | null;
}

export interface employee_employee {
  __typename: 'Employee';
  id: string | null;
  /**
   * 状态
   */
  status: EmployeeStatus | null;
  /**
   * 工号
   */
  jobNumber: string | null;
  /**
   * 头像
   */
  avatar: any | null;
  /**
   * 名称
   */
  name: string | null;
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
   * 员工的职位
   */
  positions: (employee_employee_positions | null)[] | null;
  /**
   * 主职位
   */
  primaryPosition: employee_employee_primaryPosition | null;
  /**
   * 主部门
   */
  primaryDepartment: employee_employee_primaryDepartment | null;
}

export interface employee {
  /**
   * 组织•单个组织
   */
  organization: employee_organization | null;
  /**
   * 单个员工
   */
  employee: employee_employee | null;
}

export interface employeeVariables {
  id: string;
  organization: string;
}
