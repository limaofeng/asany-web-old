/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: queryDepartments
// ====================================================

export interface queryDepartments_departments_parent {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface queryDepartments_departments_positions {
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

export interface queryDepartments_departments {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
  /**
   * 上级机构
   */
  parent: queryDepartments_departments_parent | null;
  /**
   * 部门包含的职位
   */
  positions: (queryDepartments_departments_positions | null)[] | null;
}

export interface queryDepartments {
  /**
   * 全部部门
   */
  departments: (queryDepartments_departments | null)[] | null;
}

export interface queryDepartmentsVariables {
  organization: string;
}
