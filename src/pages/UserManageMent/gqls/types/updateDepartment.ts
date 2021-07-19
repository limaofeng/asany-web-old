/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DepartmentUpdateInput } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL mutation operation: updateDepartment
// ====================================================

export interface updateDepartment_updateDepartment {
  __typename: 'Department';
  id: string | null;
}

export interface updateDepartment {
  /**
   * 更新部门信息
   */
  updateDepartment: updateDepartment_updateDepartment | null;
}

export interface updateDepartmentVariables {
  id: string;
  input: DepartmentUpdateInput;
}
