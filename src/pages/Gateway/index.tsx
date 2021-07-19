import type { ILibrary } from '@asany/components';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import GatewayManagement from './pages/GatewayManagement';
import SchemaWorkspace from './pages/Workspace';
import SchemaBatchOperation from './pages/SchemaBatchOperation';
import { RecoilRoot } from 'recoil';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

export default {
  id: 'gateway',
  name: '网关管理',
  components: [
    {
      id: 'cn.asany.shanhai.gateway.GatewayManagement',
      name: '网关管理',
      tags: ['网关管理/Schema'],
      component: () => (
        <ApolloProvider client={client}>
          <RecoilRoot>
            <GatewayManagement />
          </RecoilRoot>
        </ApolloProvider>
      ),
    },
    {
      id: 'cn.asany.shanhai.gateway.SchemaWorkspace',
      name: '工作区',
      tags: ['网关管理/Schema 工作区'],
      component: () => (
        <ApolloProvider client={client}>
          <SchemaWorkspace />
        </ApolloProvider>
      ),
    },
    {
      id: 'cn.asany.shanhai.gateway.SchemaBatchOperation',
      name: '批量操作页',
      tags: ['网关管理/Schema 工作区/批量操作页'],
      component: () => (
        <ApolloProvider client={client}>
          <SchemaBatchOperation />
        </ApolloProvider>
      ),
    },
  ],
} as ILibrary;
