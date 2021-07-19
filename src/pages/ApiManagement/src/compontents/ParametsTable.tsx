import React from "react";
import { Table } from "antd";

interface ParametsTableProps {
    dataSource?: any;
    columns: any;
}

function ParametsTable(props: ParametsTableProps) {
    const { dataSource, columns } = props;
    return (
        <Table columns={columns} rowKey={(record: any) => record.id} dataSource={dataSource} pagination={false} />
    );
};

export default ParametsTable;