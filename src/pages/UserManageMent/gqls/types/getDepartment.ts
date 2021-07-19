/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getDepartment
// ====================================================

export interface getDepartment_department_jobs {
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

export interface getDepartment_department_positions {
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

export interface getDepartment_department_parent {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface getDepartment_department_organization {
  __typename: 'Organization';
  id: string | null;
  name: string | null;
}

export interface getDepartment_department {
  __typename: 'Department';
  /**
   * 部门名称
   */
  name: string | null;
  id: string | null;
  /**
   * 部门包含的职务
   */
  jobs: (getDepartment_department_jobs | null)[] | null;
  /**
   * 部门包含的职位
   */
  positions: (getDepartment_department_positions | null)[] | null;
  /**
   * 上级机构
   */
  parent: getDepartment_department_parent | null;
  /**
   * 组织机构
   */
  organization: getDepartment_department_organization | null;
}

export interface getDepartment {
  /**
   * 单个部门
   */
  department: getDepartment_department | null;
}

export interface getDepartmentVariables {
  id: string;
}
