/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: batchUpdateEmployeePosition
// ====================================================

export interface batchUpdateEmployeePosition {
  /**
   * 批量更新员工的职位
   */
  batchUpdateEmployeePosition: boolean | null;
}

export interface batchUpdateEmployeePositionVariables {
  employees: (string | null)[];
  position: string;
}
