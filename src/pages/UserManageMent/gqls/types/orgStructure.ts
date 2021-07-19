/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: orgStructure
// ====================================================

export interface orgStructure_organization_departments_parent {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface orgStructure_organization_departments {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
  /**
   * 上级机构
   */
  parent: orgStructure_organization_departments_parent | null;
}

export interface orgStructure_organization {
  __typename: 'Organization';
  /**
   * 组织部门
   */
  departments: (orgStructure_organization_departments | null)[] | null;
}

export interface orgStructure {
  /**
   * 组织•单个组织
   */
  organization: orgStructure_organization | null;
}

export interface orgStructureVariables {
  id: string;
}
