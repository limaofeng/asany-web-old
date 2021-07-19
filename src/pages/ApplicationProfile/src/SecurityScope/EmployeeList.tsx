import { Query } from '@apollo/client/react/components';
import { QueryResult } from '@apollo/client';
import { Checkbox, Input } from 'antd';
import React from 'react';
import uniqBy from 'lodash/uniqBy';
import { employees as EMPLOYEES } from './gqls/employee.gql';
import { SelectItem, SelectItemValue } from './SecurityScopeTree';

interface EmployeeListProps {
  employees: any[];
  selectedKeys: string[];
  onSelect: (item: SelectItem, checked: boolean) => void;
}

class EmployeeList extends React.Component<EmployeeListProps> {
  handleChange = (e: any) => {
    const { employees } = this.props;
    this.props.onSelect(
      {
        key: e.target.value,
        type: 'EMPLOYEE',
        value: employees.find(item => item.key === e.target.value),
      },
      e.target.checked
    );
  };

  render() {
    const { employees, selectedKeys } = this.props;
    return (
      <Checkbox.Group value={selectedKeys}>
        {employees.map((item, index) => (
          <Checkbox
            style={{ ...(!index ? { marginLeft: 8 } : {}) }}
            key={`user-item-${item.id}`}
            value={item.key}
            onChange={this.handleChange}
          >
            {item.name}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  }
}

interface EmployeeListQueryProps {
  organization: string;
  data?: SelectItem;
  onSelect: (item: SelectItem, checked: boolean) => void;
  selectedKeys: string[];
  valuesAll: (values: string[]) => void;
}

export class EmployeeListQuery extends React.Component<EmployeeListQueryProps> {
  render() {
    const { data = { type: 'DEPARTMENT', value: undefined }, organization } = this.props;
    return this.renderQuery(organization, data as any);
  }

  renderQuery = (organization: string, item: SelectItem) => {
    const filter: any = {};
    if (item.type === 'DEPARTMENT' && item.value) {
      filter.department = item.value.id;
    } else if (item.type === 'EMPLOYEEGROUP' && item.value) {
      filter.group = item.value.id;
    }
    return (
      <Query
        query={EMPLOYEES}
        variables={{
          organization,
          filter,
        }}
      >
        {this.renderEmployeeList(filter)}
      </Query>
    );
  };

  renderEmployeeList = filterProps => ({ data, loading, refetch: employeeRefetch }: QueryResult) => {
    const { onSelect, selectedKeys, valuesAll } = this.props;
    const { employees = { edges: [] } } = data || {};
    valuesAll(
      uniqBy(
        employees.edges.map(({ node }: any) => ({ value: node, key: `EMPLOYEE_${node.id}`, type: 'EMPLOYEE' })),
        'key'
      )
    );
    return (
      <>
        <Input.Search
          placeholder="请输入搜索关键字"
          onSearch={value => {
            employeeRefetch({
              filter: {
                ...filterProps,
                name_contains: value,
              },
            });
          }}
          style={{ width: 200, position: 'absolute', top: '15px', right: '50px' }}
        />
        <EmployeeList
          selectedKeys={selectedKeys.filter(item => item.startsWith('EMPLOYEE_'))}
          onSelect={onSelect}
          employees={uniqBy(
            employees.edges.map(({ node }: any) => ({ ...node, key: `EMPLOYEE_${node.id}` })),
            'key'
          )}
        />
      </>
    );
  };
}
