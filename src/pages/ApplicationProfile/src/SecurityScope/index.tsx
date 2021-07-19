import { Button, Modal, Checkbox } from 'antd';
import debounce from 'lodash/debounce';
import React from 'react';
import { Query } from '@apollo/client/react/components';
import { QueryResult } from '@apollo/client';
import { EmployeeListQuery } from './EmployeeList';
import { loadSecurityScopes as LOADSECURITYSCOPES } from './gqls/employee.gql';
import styles from './index.less';
import SecurityScopeTagList from './SecurityScopeTag';
import SecurityScopeTree, { SelectItem, SelectItemType } from './SecurityScopeTree';
import SelectAutoInput from './SelectAutoInput';


// TODO 选择用户的组件

interface SelectAutoProps {
  organization: string;
  onChange?: (value: string[], selectItems: SelectItem[]) => void;
  value?: SelectItem[];
}
interface SelectAutoState {
  current?: SelectItem;
  value: SelectItem[];
  lastValue: SelectItem[];
}
class SelectAuto extends React.Component<SelectAutoProps, SelectAutoState> {
  model = React.createRef<SecurityScopeModel>();

  handleOutsideChange: () => void;

  constructor(props: SelectAutoProps) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
    this.state = { value: [], lastValue: [] };
    this.handleOutsideChange = () => {
      props.onChange && props.onChange(this.state.value.map(item => item.key), this.state.value);
    };
  }

  static getDerivedStateFromProps(nextProps: SelectAutoProps, prevState: SelectAutoState) {
    if (nextProps.value === prevState.lastValue) {
      return prevState;
    }
    return {
      ...prevState,
      value: nextProps.value!.map((item: any) => ({
        key: item.id,
        type: item.type.toUpperCase(),
        value: item.value,
      })),
      lastValue: nextProps.value,
    };
  }

  // 个人搜索
  fetchUser = value => {
    this.setState({
      employeeId: value,
    });
  };

  // 是否显示模态框
  showModal = () => {
    this.model.current!.open(this.props.organization, this.state.value);
  };

  handleSelect = (data: SelectItem[]) => {
    this.setState({ value: data }, this.handleOutsideChange);
  };

  render() {
    console.log('this.state.value', this.state.value);
    return (
      <div className="SelectAuto" style={{ display: 'flex' }}>
        <SelectAutoInput onChange={this.handleSelect} value={this.state.value} />
        <Button type="primary" onClick={this.showModal}>
          选择组织用户
        </Button>
        {/* 1； 弹框组件 */}
        <SecurityScopeModel ref={this.model} onSelect={this.handleSelect} />
      </div>
    );
  }
}

interface SecurityScopeBodyProps {
  organization: string;
  defaultValue?: SelectItem[];
}
interface SecurityScopeBodyState {
  current?: SelectItem;
  value: SelectItem[];
  lastDefaultValue?: SelectItem[];
  checkAll: boolean;
}

class SecurityScopeBody extends React.Component<SecurityScopeBodyProps, SecurityScopeBodyState> {
  private valueAll?: any;

  constructor(props: SecurityScopeBodyProps) {
    super(props);
    this.state = {
      value: props.defaultValue! || [],
      checkAll: false,
    };
  }

  handleTreeClick = (value?: SelectItem) => {
    this.setState({ current: value });
  };

  handleSelectSingle = (item: SelectItem, checked: boolean) => {
    const { value } = this.state;
    if (!checked) {
      this.handleRemove(item);
      this.setState({
        checkAll: false, // 子项有未选中，全选按钮不勾选
      });
    } else {
      this.setState({
        value: [...value, item],
        checkAll: [...value, item].length === this.valueAll.length, // 子项全选中，全选按钮勾选
      });
    }
  };

  handleSelect = (type: SelectItemType, items: SelectItem[]) => {
    const { value } = this.state;
    this.setState({
      value: [
        ...value.filter(v => {
          if (v.type === type) {
            return items.some(item => item.key === v.key);
          }
          return true;
        }),
        ...items.filter(item => !value.some(v => item.key === v.key)),
      ],
    });
  };

  handleRemove = (item: SelectItem) => {
    const { value } = this.state;
    this.setState({ value: value.filter(v => v.key !== item.key) });
  };

  getValuesAll = (valuesAll: any) => {
    // 获取到人员信息
    this.valueAll = valuesAll;
  };

  onCheckAllChange = (e: any) => {
    // 全选操作
    this.setState({
      checkAll: e.target.checked,
      value: e.target.checked ? this.valueAll : [],
    });
  };

  render() {
    const { organization } = this.props;
    const { value, current, checkAll } = this.state;
    return (
      <div className={styles.modelContent}>
        <div className={styles.modelTree}>
          {/* 3； 侧边栏树形结构 SecurityScopeTree */}
          <SecurityScopeTree
            organization={organization}
            onClick={this.handleTreeClick}
            onSelect={this.handleSelect}
            selectedKeys={value.map((item) => item.key)}
          />
        </div>
        <div className={styles.modelChecked} style={{ flexDirection: 'column', display: 'flex', position: 'relative' }}>
          <h4>
            用户列表
            <Checkbox onChange={this.onCheckAllChange} checked={checkAll} style={{ margin: '0px 20px' }}>
              全选
            </Checkbox>
          </h4>
          <div style={{ flex: 1, padding: '10px',paddingTop:'20px' }}>
            {/* 3； 用户选择 EmployeeListQuery */}
            <EmployeeListQuery
              onSelect={this.handleSelectSingle}
              organization={organization}
              data={current}
              selectedKeys={value.map((item) => item.key)}
              valuesAll={this.getValuesAll}
            />
          </div>
          <div className={styles.footerTags}>
            {/* 3； 用户选择 选中框选中内容 */}
            <SecurityScopeTagList items={value} onRemove={this.handleRemove} />
          </div>
        </div>
      </div>
    );
  }
}

interface SecurityScopeModelState {
  visible: boolean;
  organization?: string;
  value?: SelectItem[];
}
interface SecurityScopeModelProps {
  onSelect: (value: SelectItem[]) => void;
}

class SecurityScopeModel extends React.Component<SecurityScopeModelProps, SecurityScopeModelState> {
  valueRef = React.createRef<SecurityScopeBody>();

  constructor(props: any) {
    super(props);
    this.state = { visible: false };
  }

  handleOk = (e: React.MouseEvent) => {
    const { onSelect } = this.props;
    this.setState({
      visible: false,
    });
    if (!onSelect) {
      return;
    }
    onSelect(this.valueRef.current!.state.value);
  };

  handleCancel = (e: React.MouseEvent) => {
    this.setState({
      visible: false,
    });
  };

  open = (organization: string, value?: SelectItem[]) => {
    this.setState({
      visible: true,
      organization,
      value,
    });
  };

  render() {
    const { organization, visible, value } = this.state;
    return (
      // 弹出框
      <Modal title="选择组织用户" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} width="60%">
        {/* 2弹出框内容SecurityScopeBody */}
        {organization && <SecurityScopeBody organization={organization!} ref={this.valueRef} defaultValue={value} />}
      </Modal>
    );
  }
}

interface LoadSecurityScopeProps {
  organization: string;
  onChange?: (value: string[], selectItems: SelectItem[]) => void;
  value: string[];
  stateEMPLOYEE?: number; // 是否在没有EMPLOYEE_ 时添加EMPLOYEE_  1：不需要
}

export default class LoadSecurityScope extends React.Component<LoadSecurityScopeProps> {
  static defaultProps = {
    value: [],
  };

  renderInput = ({ data }: QueryResult) => {
    const { value, ...props } = this.props;
    const { securityScopes = [] } = data || {};
    return <SelectAuto {...props} value={securityScopes} />;
  };

  render() {
    const { value, ...props } = this.props;
    // console.log(this.props);

    let val: any = [];
    // --当数据既没有 EMPLOYEE_ 用户 DEPARTMENT_ 组织 全部添加 EMPLOYEE_ （数据返现的时候传入的是id）
    if (value && value[0] && value[0].search('EMPLOYEE_') === -1 && value[0].search('DEPARTMENT_') === -1) {
      val = value && value.map((item: any) => `EMPLOYEE_${item}`);
    } else {
      val = value;
    }

    // 当没选择数据时 返回空数据
    if (!value.length) {
      return <SelectAuto {...props} value={[]} />;
    }
    return (
      <Query
        query={LOADSECURITYSCOPES}
        fetchPolicy="no-cache"
        variables={{ ids: value && value && value[0] && value[0].search('EMPLOYEE_') === -1 ? val : value }}
      >
        {this.renderInput}
      </Query>
    );
  }
}
