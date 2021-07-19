/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOrgs
// ====================================================

export interface getOrgs_organizations {
  __typename: 'Organization';
  id: string | null;
  name: string | null;
  /**
   * 创建人
   */
  creator: string | null;
  /**
   * 修改人
   */
  modifier: string | null;
  /**
   * 创建时间
   */
  createdAt: any | null;
  /**
   * 修改时间
   */
  updatedAt: any | null;
}

export interface getOrgs {
  /**
   * 组织•组织列表
   */
  organizations: (getOrgs_organizations | null)[] | null;
}
