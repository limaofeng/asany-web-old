import React, { Component } from 'react';

import { Table } from 'antd';

interface IUserManageAddTableProps {
  departColumns: any;
  listData: any;
  selectRadio: (x: any, y: any) => void;
}

export default class UserManageAddTable extends Component<IUserManageAddTableProps> {
  public state = {
    listDataSource: [],
  };

  public componentDidMount = () => {
    this.setState({ listDataSource: this.props.listData }, () => {
      this.props.onChange(this.state.listDataSource);
    });
  };

  public componentWillReceiveProps = nextprops => {
    if (nextprops.listData.length !== this.props.listData.length) {
      this.setState({ listDataSource: nextprops.listData }, () => {
        this.props.onChange(this.state.listDataSource);
      });
    }
  };

  render() {
    const { departColumns, listData } = this.props;
    return (
      <div>
        <Table
          locale={{
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: 'no data',
          }}
          size="small"
          columns={departColumns}
          dataSource={this.state.listDataSource}
          pagination={false}
          rowSelection={{
            type: 'radio',
            columnTitle: '主要职务',
            columnWidth: 90,
            getCheckboxProps: record => ({
              // defaultChecked: record.id === departmentId,
            }),
            onChange: (selectedRowKeys, selectedRows) => {
              this.props.selectRadio(selectedRowKeys, selectedRows);
            },
          }}
        />
      </div>
    );
  }
}
