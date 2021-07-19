import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, Col, Row, Select, message } from 'antd';
import React, { Component } from 'react';

import { Query } from '@apollo/client/react/components';
import { isEqual } from 'lodash';
import { queryDepartments as ALLDEPARTMENT } from '../gqls/userManage.gql';
import { tree } from '@/pages/WisdomPartyBuilding/utils/utils';

const { Option } = Select;

interface ITableRowItemProps {
  departments: any[];
  ignorePositions: any[];
  value: any;
  onChange: (value: any) => void;
  remove?: () => void;
}

class TableRowItem extends Component<ITableRowItemProps> {
  handleChange = value => {
    const { onChange } = this.props;
    onChange({
      ...this.props.value,
      ...value,
    });
  };

  handleSelect = value => {
    this.handleChange({ value });
  };

  handleDepartmentChange = values => {
    const {
      departments,
      value: { value },
      ignorePositions,
    } = this.props;
    const department = departments.find(item => item.id == values[values.length - 1]);
    let positions = department ? department.positions : [];
    positions = positions.filter(({ id }) => !ignorePositions.some(ignore => ignore == id));
    const position = positions.find(item => item == value);
    const newValue = position ? position.id : positions.length ? positions[0].id : null;
    this.handleChange({ value: newValue, department: department.id });
  };

  getPositions = values => {
    const { departments } = this.props;
    const department = departments.find(item => item.id == values[values.length - 1]);
    return department ? department.positions : [];
  };

  handleCheckboxPrimary = e => {
    if (this.props.value.primary) {
      return;
    }
    this.handleChange({ primary: true });
  };

  getDepartmentValue = value => {
    const values = [];
    const { departments } = this.props;
    const department = departments.find(item => item.id === value);
    if (department) {
      values.unshift(department.id);
      if (department.parent) {
        values.unshift(...this.getDepartmentValue(department.parent.id));
      }
    }
    return values;
  };

  render() {
    const {
      remove,
      departments,
      value: { department, value, primary = false },
      ignorePositions,
    } = this.props;
    console.log('tabledatachild', this.props);
    const cascaderValue = this.getDepartmentValue(department);
    let positions = this.getPositions(cascaderValue);
    positions = positions.filter(({ id }) => !ignorePositions.some(ignore => ignore == id));
    return (
      <Row type="flex" justify="center">
        <Col span={3}>
          <Checkbox checked={primary} onChange={this.handleCheckboxPrimary} />
        </Col>
        <Col span={9}>
          <Cascader
            fieldNames={{ label: 'name', value: 'id', children: 'children' }}
            options={tree(
              departments.map(item => ({ ...item })),
              {
                idKey: 'id',
                pidKey: 'parent.id',
                childrenKey: 'children',
              }
            )}
            onChange={this.handleDepartmentChange}
            value={cascaderValue}
            allowClear={false}
            placeholder="请选择部门"
          />
        </Col>
        <Col span={5}>
          <Select onSelect={this.handleSelect} value={value}>
            {positions.map(ele => (
              <Option key={ele.id}>{ele.name}</Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>{remove && <Button icon={<CloseOutlined />} onClick={remove} />}</Col>
      </Row>
    );
  }
}

interface ITableWrapperProps {
  organization: string;
  onChange?: (value: any) => void;
  value?: any[];
}

interface ITableWrapperState {
  lastValue?: any[];
  positions: any[];
}

export default class TableWrapper extends Component<ITableWrapperProps, ITableWrapperState> {
  static defaultProps = {
    onChange: () => {},
  };

  constructor(props: ITableWrapperProps) {
    super(props);
    this.state = {
      positions: props.value!,
    };
  }

  static getDerivedStateFromProps(nextProps: ITableWrapperProps, prevState: ITableWrapperState) {
    if (nextProps.value === prevState.lastValue) {
      return null;
    }
    return {
      lastValue: nextProps.value,
      positions: nextProps.value,
    };
  }

  handleChange = () => {
    const { positions = [] } = this.state;
    const { onChange } = this.props;
    onChange!(positions.map(item => ({ primary: item.primary, position: item.value })));
  };

  handleItemChange = index => value => {
    const { positions = [] } = this.state;
    this.setState(
      {
        positions: positions.map((item, i) => {
          if (i === index) {
            return { ...value };
          }
          if (value.primary) {
            item.primary = false;
          }
          return item;
        }),
      },
      this.handleChange
    );
  };

  handleRemove = (index: any) => () => {
    const { positions = [] } = this.state;
    console.log(positions.filter((item, i) => i !== index));
    this.setState({ positions: [...positions.filter((item, i) => i !== index)] }, this.handleChange);
  };

  handleNew = () => {
    const { positions = [] } = this.state;
    positions.push({});

    this.setState({ positions: [...positions] }, this.handleChange);
  };

  render() {
    const { organization } = this.props;
    const { positions } = this.state;
    console.log('tabledata', this.props);
    if (!organization) {
      return <div />;
    }
    return (
      <Query query={ALLDEPARTMENT} variables={{ organization }}>
        {({ data }): any => {
          const { departments = [] } = data || {};
          console.log(departments);
          return <>
            <Row>
              <Col span={21}>
                <Row type="flex" justify="center">
                  <Col span={3}>主要职务</Col>
                  <Col span={9}>部门</Col>
                  <Col span={5}>职位</Col>
                  <Col span={4}>操作</Col>
                </Row>
                {positions &&
                  positions.map((value, i) => (
                    <TableRowItem
                      departments={departments}
                      key={i}
                      value={value}
                      onChange={this.handleItemChange(i)}
                      ignorePositions={positions.map(item => item.value).filter(item => item != value.value)}
                      remove={positions.length > 1 ? this.handleRemove(i) : null}
                    />
                  ))}
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Button type="dashed" onClick={this.handleNew} style={{ width: '100%' }}>
                  <PlusOutlined />
                  添加到其他部门
                </Button>
              </Col>
            </Row>
          </>;
        }}
      </Query>
    );
  }
}
