/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: queryJobs
// ====================================================

export interface queryJobs_organization_jobs {
  __typename: 'Job';
  /**
   * 职务
   */
  id: string | null;
  /**
   * 职务名称
   */
  name: string | null;
}

export interface queryJobs_organization {
  __typename: 'Organization';
  /**
   * 组织职位
   */
  jobs: (queryJobs_organization_jobs | null)[] | null;
}

export interface queryJobs {
  /**
   * 组织•单个组织
   */
  organization: queryJobs_organization | null;
}

export interface queryJobsVariables {
  id: string;
}
