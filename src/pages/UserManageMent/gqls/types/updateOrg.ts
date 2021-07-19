/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrganizationUpdateInput } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL mutation operation: updateOrg
// ====================================================

export interface updateOrg_organization {
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

export interface updateOrg {
  /**
   * 更新组织信息
   */
  organization: updateOrg_organization | null;
}

export interface updateOrgVariables {
  id: string;
  input: OrganizationUpdateInput;
}
