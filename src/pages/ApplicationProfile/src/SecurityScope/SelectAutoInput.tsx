import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { SelectItem } from './SecurityScopeTree';

const { Option } = Select;

interface SelectAutoProps {
  onChange: (value: SelectItem[]) => void;
  value: SelectItem[];
}
class SelectAutoInput extends React.Component<SelectAutoProps> {
  constructor(props: SelectAutoProps) {
    super(props);
    // this.lastFetchId = 0;
    // this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchUser = value => {
    // console.log('fetching user', value);
    // this.lastFetchId += 1;
    // const fetchId = this.lastFetchId;
    // this.setState({ data: [], fetching: true });
    // fetch('https://randomuser.me/api/?results=5')
    //   .then(response => response.json())
    //   .then(body => {
    //     if (fetchId !== this.lastFetchId) {
    //       // for fetch callback order
    //       return;
    //     }
    //     const data = body.results.map(user => ({
    //       text: `${user.name.first} ${user.name.last}`,
    //       value: user.login.username,
    //     }));
    //     this.setState({ data, fetching: false });
    //   });
  };

  handleChange = (value: any[]) => {
    const { value: preValue } = this.props;
    const data: SelectItem[] = [
      {
        key: 'EMPLOYEE_703',
        type: 'EMPLOYEE',
        value: { id: '703', name: '陈继云' },
      },
      {
        key: 'EMPLOYEE_715',
        type: 'EMPLOYEE',
        value: { id: '715', name: '毛灵' },
      },
    ];

    this.props.onChange(
      value.map(v => {
        if (typeof v === 'string') {
          v = 'EMPLOYEE_703';
          return data.find(item => item.key === v)!;
        }
        return preValue.find(item => item.key === v.key)!;
      })
    );
  };

  render() {
    const value = this.props.value.map(item => (
      <span key={item.key}>
        {item.value.name}
        {/* {item.type} | {item.value.name} */}
      </span>
    ));
    return (
      <div style={{ width: '100%' }}>
        <Select
          mode="multiple"
          value={value}
          placeholder="请选择..."
          // notFoundContent={this.fetching ? <Spin size="small" /> : null}
          filterOption={false}
          onSearch={this.fetchUser}
          onChange={this.handleChange}
          style={{ width: '100%', minWidth: '200px' }}
          open={false}
        >
          {/* this.state.data.map(d => (
            <Option key={d.value}>{d.text}</Option>
          )) */}
        </Select>
      </div>
    );
  }
}
export default SelectAutoInput;
