import { CloseOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Row, Select, message } from 'antd';
import { Mutation, Query } from '@apollo/client/react/components';
import React, { Component } from 'react';

import { queryDepartmentInfo as QUERY_DEPARTMENT_INFO } from '../gqls/userManage.gql';

const { Option } = Select;

interface ITableRowItemsProps {
  dataSource: any;
  onChange: (x: any) => void;
}

interface ITableRowItemProps {
  rowData: any;
  onChange: (x: any) => void;
  handleOnDelete: (x: any) => void;
  isSameJobs: (x: any) => boolean;
}

class TableRowItem extends Component<ITableRowItemProps> {
  public state = {
    selectValue: '',
  };

  public handleSelect = (value, option, rowData) => {
    const sameFlag = this.props.isSameJobs({ department: rowData.department, jobId: value });
    if (sameFlag) {
      this.setState({ selectValue: '' }, () => {
        message.warning('部门已有职务！');
      });
      return;
    }
    this.setState({ selectValue: value });

    this.props.onChange({ jobId: value, department: rowData.department, id: rowData.id });
  };

  public handleOnDelete = () => {
    this.props.handleOnDelete(this.state.selectValue);
  };

  render() {
    const { rowData } = this.props;
    console.log('rowData', rowData);
    return (
      <Row type="flex" justify="center">
        <Col span={6}>
          <Checkbox />
        </Col>
        <Col span={6}>{rowData.department}</Col>
        <Col span={6}>
          <Query query={QUERY_DEPARTMENT_INFO} variables={{ id: rowData.id }}>
            {({ data }) => {
              const { department = { positions: [] } } = data || {};
              return (
                <Select
                  onSelect={(value, option) => this.handleSelect(value, option, rowData)}
                  value={this.state.selectValue}
                >
                  {department.positions.map(ele => (
                    <Option key={ele.id}>{ele.name}</Option>
                  ))}
                </Select>
              );
            }}
          </Query>
        </Col>
        <Col span={6}>
          <Button icon={<CloseOutlined />} onClick={this.handleOnDelete} />
        </Col>
      </Row>
    );
  }
}

export default class TableRowItems extends Component<ITableRowItemsProps> {
  public state = {
    changeArr: [],
  };

  public handleRowChange = (rowObj, index) => {
    const changeArrCopy = JSON.parse(JSON.stringify(this.state.changeArr));
    rowObj.onlyId = index;
    if (changeArrCopy.length !== 0) {
      const hasRow = changeArrCopy.findIndex(ele => rowObj.onlyId === ele.onlyId);
      if (hasRow === -1) {
        // 找不到
        const hasName = changeArrCopy.findIndex(ele => rowObj.department === ele.department);
        // if (hasName === -1) {
        // 部门不相同
        changeArrCopy.push(rowObj);
        this.setState({ changeArr: changeArrCopy }, () => {
          this.props.onChange(this.state.changeArr);
        });
        // } else {
        //   if(changeArrCopy[hasName].)
        // }
      } else {
        // 找的到替换
        changeArrCopy.splice(hasRow, 1, rowObj);
        this.setState({ changeArr: changeArrCopy }, () => {
          this.props.onChange(this.state.changeArr);
        });
      }
    } else {
      changeArrCopy.push(rowObj);
      this.setState({ changeArr: changeArrCopy }, () => {
        this.props.onChange(this.state.changeArr);
      });
    }
    console.log('外部村的', this.state.changeArr);
  };

  public handleOnDelete = jobId => {
    // this.state.changeArr.
    // this.props.dataSource.splice()
  };

  // 判断是否重复
  public isSameJobs = obj => {
    console.log('changeArr', this.state.changeArr);
    let sameFalg;
    for (const k in this.state.changeArr) {
      if (this.state.changeArr[k].jobId === obj.jobId) {
        sameFalg = true;
        return;
      }
      sameFalg = false;
    }
    return sameFalg;
  };

  render() {
    const { dataSource } = this.props;
    console.log('12', dataSource);
    return (
      <div>
        <Row type="flex" justify="center">
          <Col span={6}>主要任务</Col>
          <Col span={6}>部门</Col>
          <Col span={6}>职务</Col>
          <Col span={6}>操作</Col>
        </Row>
        {dataSource.map((ele, index) => (
          <TableRowItem
            key={index}
            rowData={ele}
            onChange={rowObj => this.handleRowChange(rowObj, index)}
            handleOnDelete={this.handleOnDelete}
            isSameJobs={this.isSameJobs}
          />
        ))}
      </div>
    );
  }
}
