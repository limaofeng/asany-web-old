import React from 'react';
import Input from '../asany-editor/components/aside/components/data-entry/Input';
import TextArea from '../asany-editor/components/aside/components/data-entry/TextArea';

function BasicInfo() {
  return (
    <>
      <div className="gse_row_details_section">
        <div className="gse_row_details_section_name">基本信息</div>
        <div className="gse_row_details_section_items">
          <div className="gse_row_details_line_items">
            <div className="gse_row_details_line_item flex items-center">
              <label>名称</label>
              <Input className="flex-1" />
            </div>
            <div className="gse_row_details_line_item flex items-center">
              <label>默认值</label>
              <Input className="flex-1" />
            </div>
            <div className="gse_row_details_line_item flex items-center">
              <label>描述</label>
              <TextArea className="flex-1" autoSize={{ minRows: 3, maxRows: 7 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BasicInfo;
