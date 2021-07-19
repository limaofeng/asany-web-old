/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrganizationCreateInput } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL mutation operation: createOrg
// ====================================================

export interface createOrg_organization {
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

export interface createOrg {
  /**
   * 创建组织
   */
  organization: createOrg_organization | null;
}

export interface createOrgVariables {
  input: OrganizationCreateInput;
}
