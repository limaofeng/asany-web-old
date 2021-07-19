/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EmployeeCreateInput } from './../../../../types/graphql-global-types';

// ====================================================
// GraphQL mutation operation: addUser
// ====================================================

export interface addUser_createEmployee_departments {
  __typename: 'Department';
  id: string | null;
  /**
   * 部门名称
   */
  name: string | null;
}

export interface addUser_createEmployee {
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
  departments: (addUser_createEmployee_departments | null)[] | null;
}

export interface addUser {
  /**
   * 创建员工
   */
  createEmployee: addUser_createEmployee | null;
}

export interface addUserVariables {
  input: EmployeeCreateInput;
}
