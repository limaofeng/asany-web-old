import { useQuery } from '@apollo/client';
import React from 'react';

import RouterManage from '../RouterSettings/components/RouterManage';

import { queryApplicationRoutes as QUERYAPPLICATIONROUTES } from '../gqls/ApplicationGql.gql';
import { Skeleton } from 'antd';

function Route(props: any): React.ReactNode {
  const id = process.env.APPID;

  const { data, loading, refetch } = useQuery(QUERYAPPLICATIONROUTES, {
    variables: {
      id,
    },
  });

  const { application } = data || {};

  return (
    <Skeleton loading={loading} active paragraph={{ rows: 16 }}>
      {!loading && <RouterManage refetch={refetch} app={application} />}
    </Skeleton>
  );
}

export default Route;
