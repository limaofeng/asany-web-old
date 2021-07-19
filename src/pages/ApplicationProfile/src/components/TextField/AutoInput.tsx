import { Input } from 'antd';
import { InputProps } from 'antd/es/input';
import React from 'react';
import { debounce } from 'lodash';

interface AutoInputProps extends InputProps {}

interface AutoInputState {
  preValue: string;
  value: string;
}

export default class AutoInput extends React.Component<AutoInputProps, AutoInputState> {
  constructor(props: AutoInputProps) {
    super(props);
    this.state = {
      preValue: props.value as string,
      value: props.value as string,
    };
    this.handleOnChange = debounce(this.handleOnChange, 1000);
  }

  handleOnChange = () => {
    const { preValue, value } = this.state;
    if (preValue !== value) {
      if (this.props.onChange) {
        this.props.onChange(value as any);
      }
    }
  };

  handleChange = (e: React.ChangeEvent<any>) => {
    const { value } = this.state;
    this.setState({ preValue: value, value: e.target.value }, this.handleOnChange);
  };

  render() {
    return (
      <Input
        style={{ minWidth: '500px' }}
        bordered
        {...this.props}
        value={this.state.value !== undefined ? this.state.value : this.props.value}
        onChange={this.handleChange}
      />
    );
  }
}
