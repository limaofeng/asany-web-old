/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EmployeeStatus, Sex } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL query operation: queryDepartmentInfo
// ====================================================

export interface queryDepartmentInfo_department_jobs {
  __typename: 'Job';
  /**
   * 职务
   */
  id: string | null;
  /**
   * 职务名称
   */
  name: string | null;
}

export interface queryDepartmentInfo_department_positions {
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

export interface queryDepartmentInfo_department_parent {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface queryDepartmentInfo_department_employees_positions {
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

export interface queryDepartmentInfo_department_employees {
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
  positions: (queryDepartmentInfo_department_employees_positions | null)[] | null;
}

export interface queryDepartmentInfo_department {
  __typename: 'Department';
  /**
   * 部门名称
   */
  name: string | null;
  id: string | null;
  /**
   * 部门包含的职务
   */
  jobs: (queryDepartmentInfo_department_jobs | null)[] | null;
  /**
   * 部门包含的职位
   */
  positions: (queryDepartmentInfo_department_positions | null)[] | null;
  /**
   * 上级机构
   */
  parent: queryDepartmentInfo_department_parent | null;
  /**
   * 部门员工
   */
  employees: (queryDepartmentInfo_department_employees | null)[] | null;
}

export interface queryDepartmentInfo {
  /**
   * 单个部门
   */
  department: queryDepartmentInfo_department | null;
}

export interface queryDepartmentInfoVariables {
  id: string;
}
