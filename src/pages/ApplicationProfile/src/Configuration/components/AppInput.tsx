import React, { Component } from 'react';

import { Input } from 'antd';
import { debounce } from 'lodash';
import style from '../../Application.less';

const { TextArea } = Input;
interface IselectSearchProps {
  isTextArea: boolean;
  value?: any;
  onChange?: any;
  style?: React.CSSProperties;
}
interface IselectSearchState {
  value: any;
}
export default class AppInput extends Component<IselectSearchProps, IselectSearchState> {
  constructor(props: any) {
    super(props);
    const {value} = props
    this.state = { value };
    this.handleSave = debounce(this.handleSave, 2000);
  }

  componentWillMount = () => {};


  // 点击确定
  handleSave = () => {
    // e.preventDefault();
    const stateValue = this.state.value;
    if (stateValue !== undefined) {
      if (this.props.value !== stateValue) {
        this.props.onChange(this.state.value);
      }
    }
  };

  handleInputOnchange = async (e: any) => {
    this.setState({ value: e.target.value }, () => {});
    this.handleSave();
  };

  render() {
    const { isTextArea } = this.props
    const { value } = this.state
    return (
      <div className={style.appInput}>
        {isTextArea ? (
          <TextArea
            style={{ minWidth: '500px' }}
            bordered
            className="text"
            onChange={this.handleInputOnchange}
            placeholder="请输入应用描述，点击图标保存。"
            value={value}
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
        ) : (
          <Input
            className="input"
            name="form-field-name"
            value={value}
            onChange={this.handleInputOnchange}
          />
        )}
      </div>
    );
  }
}
