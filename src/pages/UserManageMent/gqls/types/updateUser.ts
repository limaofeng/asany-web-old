/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EmployeeUpdateInput } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL mutation operation: updateUser
// ====================================================

export interface updateUser_updateEmployee_departments {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface updateUser_updateEmployee {
  __typename: 'Employee';
  id: string | null;
  /**
   * 名称
   */
  name: string | null;
  /**
   * 工号
   */
  jobNumber: string | null;
  /**
   * 所属部门
   */
  departments: (updateUser_updateEmployee_departments | null)[] | null;
}

export interface updateUser {
  /**
   * 更新员工
   */
  updateEmployee: updateUser_updateEmployee | null;
}

export interface updateUserVariables {
  id: string;
  input: EmployeeUpdateInput;
}
