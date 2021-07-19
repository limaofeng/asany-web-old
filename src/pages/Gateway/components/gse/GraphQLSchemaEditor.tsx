import React, { useCallback, useState } from 'react';
import classnames from 'classnames';

import GraphQLSchemaRow, { Status } from './GraphQLSchemaRow';

interface TabsProps {
  defaultActiveKey: string;
  className?: string;
  children: React.ReactNodeArray | React.ReactNode;
}

function Tabs(props: TabsProps) {
  const { className } = props;
  const nodes = React.Children.toArray(props.children);
  const [activeKey, setActiveKey] = useState(props.defaultActiveKey);
  const node = nodes.find((item: any) => item.key.replace(/^.\$/, '') === activeKey);
  const handleChange = useCallback((e: React.MouseEvent) => {
    setActiveKey((e.target as any).dataset.key);
  }, []);
  return (
    <>
      <div className={classnames('gsve-toggle flex flex-row items-center', className)}>
        {nodes.map((item: any) => (
          <div
            key={item.key}
            onClick={handleChange}
            data-key={item.key.replace(/^.\$/, '')}
            className={classnames('toggle-button', { ['is-on']: activeKey == item.key.replace(/^.\$/, '') })}
          >
            {item.props.tab}
            <div className="toggle-button-bg" />
          </div>
        ))}
      </div>
      {node}
    </>
  );
}

interface TabPaneProps {
  tab: string;
  children: React.ReactNode;
}

function TabPane(props: TabPaneProps) {
  const { children } = props;
  return <>{children}</>;
}

export type ObjectType = {
  id: string;
  name?: string;
  status: Status;
  type?: string;
  children?: ObjectType[];
};

function Schema() {
  const [items, setItems] = useState<ObjectType[]>([
    {
      id: 'arguments',
      status: 'inline-edit',
      type: 'arguments',
      children: [
        {
          id: 'loginType',
          name: 'loginType',
          status: 'inline-edit',
          type: 'LoginType',
        },
        {
          id: 'username',
          name: 'username',
          status: 'inline-edit',
          type: 'String',
        },
        {
          id: 'authcode',
          name: 'authCode',
          status: 'inline-edit',
          type: 'String',
        },
        {
          id: 'tmpAuthCode',
          name: 'tmpAuthCode',
          status: 'inline-edit',
          type: 'String',
        },
        {
          id: 'options',
          name: 'options',
          status: 'inline-edit',
          type: 'LoginOptions',
        },
      ],
    },
    {
      id: 'options',
      name: 'options',
      status: 'inline-edit',
      type: 'LoginOptions',
    },
  ]);

  const handleSwitchStatus = (id: string) => (status: Status) => {
    setItems(items.map((item) => (item.id == id ? { ...item, status } : { ...item, status: 'inline-edit' })));
  };

  return (
    <div className="schema-type">
      <Tabs className="gse-header-editing" defaultActiveKey="schema">
        <TabPane tab="Schema" key="schema">
          <ul className="gse-list flex flex-col">
            {items.map((item) => (
              <GraphQLSchemaRow
                data={item}
                key={item.id}
                switchStatus={handleSwitchStatus(item.id)}
                status={item.status}
              />
            ))}
          </ul>
        </TabPane>
        <TabPane tab="GraphQL" key="graphql">
          xxx
        </TabPane>
        <TabPane tab="Example" key="example">
          xxx
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Schema;
