/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: queryDepartment
// ====================================================

export interface queryDepartment_department_jobs {
  __typename: 'Job';
  /**
   * 职务名称
   */
  name: string | null;
  /**
   * 职务
   */
  id: string | null;
}

export interface queryDepartment_department_parent {
  __typename: 'Department';
  /**
   * 部门名称
   */
  name: string | null;
  id: string | null;
}

export interface queryDepartment_department_children {
  __typename: 'Department';
  /**
   * 部门名称
   */
  name: string | null;
  id: string | null;
}

export interface queryDepartment_department_organization {
  __typename: 'Organization';
  name: string | null;
  id: string | null;
}

export interface queryDepartment_department {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门编码
   */
  sn: string | null;
  /**
   * 部门名称
   */
  name: string | null;
  /**
   * 排序字段
   */
  sort: number | null;
  /**
   * 部门包含的职务
   */
  jobs: (queryDepartment_department_jobs | null)[] | null;
  /**
   * 部门描述信息
   */
  description: string | null;
  /**
   * 上级机构
   */
  parent: queryDepartment_department_parent | null;
  /**
   * 下属部门
   */
  children: (queryDepartment_department_children | null)[] | null;
  /**
   * 组织机构
   */
  organization: queryDepartment_department_organization | null;
}

export interface queryDepartment {
  /**
   * 单个部门
   */
  department: queryDepartment_department | null;
}

export interface queryDepartmentVariables {
  id: string;
}
