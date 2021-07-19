/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DepartmentCreateInput } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL mutation operation: createDepartment
// ====================================================

export interface createDepartment_createDepartment {
  __typename: 'Department';
  id: string | null;
}

export interface createDepartment {
  /**
   * 创建部门
   */
  createDepartment: createDepartment_createDepartment | null;
}

export interface createDepartmentVariables {
  organization?: string | null;
  input: DepartmentCreateInput;
}
