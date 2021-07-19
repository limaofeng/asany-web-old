import { Checkbox } from 'antd';
import React from 'react';
import Input from '../asany-editor/components/aside/components/data-entry/Input';
import InputNumber from '../asany-editor/components/aside/components/data-entry/InputNumber';

function Validations() {
  return (
    <>
      <div className="gse_row_details_section">
        <div className="gse_row_details_section_name">基本验证</div>
        <div className="gse_row_details_section_items">
          <div className="gse_row_details_line_items">
            <div className="gse_row_details_line_item flex items-center">
              <Checkbox>必需的?</Checkbox>
            </div>
            <div className="gse_row_details_line_item flex items-center">
              <label>默认值</label>
              <Input className="flex-1" />
            </div>
          </div>
        </div>
      </div>
      <div className="gse_row_details_section">
        <div className="gse_row_details_section_name">字符串验证</div>
        <div className="gse_row_details_section_items">
          <div className="gse_row_details_line_items">
            <div className="gse_row_details_line_item flex space-x-4 items-center">
              <div className="flex-1 flex items-center">
                <label>最小长度</label>
                <InputNumber className="flex-1" />
              </div>
              <div className="flex-1 flex items-center">
                <label>最大长度</label>
                <InputNumber className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Validations;
