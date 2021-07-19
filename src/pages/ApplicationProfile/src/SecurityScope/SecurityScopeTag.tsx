import { Icon, Tag } from 'antd';

import React from 'react';
import { SelectItem } from './SecurityScopeTree';

interface SecurityScopeTagProps {
  value: SelectItem;
  onClose: (value: SelectItem) => void;
}

export class SecurityScopeTag extends React.Component<SecurityScopeTagProps> {
  handleClose = () => {
    const { value, onClose } = this.props;
    onClose(value);
  };

  renderIcon = (value: SelectItem) => {
    switch (value.type) {
      case 'EMPLOYEE':
        return <Icon type="user" />;
      case 'DEPARTMENT':
        return <Icon type="deployment-unit" />;
      case 'EMPLOYEEGROUP':
        return <Icon type="usergroup-add" />;
      case 'ROLE':
        return <Icon type="usergroup-add" />;
      case 'ORGANIZATION':
        return <Icon type="usergroup-add" />;
      default:
        return undefined;
    }
  };

  render() {
    const { value } = this.props;
    return (
      <Tag closable onClose={this.handleClose}>
        {this.renderIcon(value)} {value.value.name}
      </Tag>
    );
  }
}

interface SecurityScopeTagListProps {
  items: SelectItem[];
  onRemove: (item: SelectItem) => void;
}

export default class SecurityScopeTagList extends React.Component<SecurityScopeTagListProps> {
  handleRemove = (item: SelectItem) => {
    this.props.onRemove(item);
  };

  static defaultProps = {
    items: [],
  };

  render() {
    const { items } = this.props;
    return items.map(item => <SecurityScopeTag onClose={this.handleRemove} key={`tag-${item.key}`} value={item} />);
  }
}
