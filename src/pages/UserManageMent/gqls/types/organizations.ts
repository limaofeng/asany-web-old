/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: organizations
// ====================================================

export interface organizations_organizations {
  __typename: 'Organization';
  id: string | null;
  name: string | null;
}

export interface organizations {
  /**
   * 组织•组织列表
   */
  organizations: (organizations_organizations | null)[] | null;
}
