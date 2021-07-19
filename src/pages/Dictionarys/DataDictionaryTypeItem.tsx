import { FormComponentProps } from '@ant-design/compatible/es/form';
import { DeleteOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
import React from 'react';
import { DataDictionaryTypeEdit, DataDictionaryTypeNew, DeleteDictionaryType } from './DataDictionaryTypeSave';
import styles from './DataDictionaryTypeItem.less';

interface DataDictionaryTypeItemProps extends FormComponentProps {
  onSave: () => void;
  value: any;
}
class DataDictionaryTypeItem extends React.Component<DataDictionaryTypeItemProps, any> {
  render() {
    const { value } = this.props;
    return (
      <a className={styles.operation}>
        {value.name}
        <div className="operationBody">
          <div className="iconbody">
            {!value.children && (
              <DeleteDictionaryType data={value} onDelete={this.props.onSave}>
                <DeleteOutlined />
              </DeleteDictionaryType>
            )}
            <DataDictionaryTypeNew data={{ parent: value }} onSave={this.props.onSave}>
              <FileAddOutlined />
            </DataDictionaryTypeNew>
            <DataDictionaryTypeEdit data={value} onSave={this.props.onSave}>
              <EditOutlined />
            </DataDictionaryTypeEdit>
          </div>
        </div>
      </a>
    );
  }
}
export default DataDictionaryTypeItem;
