/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getDept
// ====================================================

export interface getDept_organizations_departments {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface getDept_organizations {
  __typename: 'Organization';
  /**
   * 组织部门
   */
  departments: (getDept_organizations_departments | null)[] | null;
}

export interface getDept {
  /**
   * 组织•组织列表
   */
  organizations: (getDept_organizations | null)[] | null;
}
