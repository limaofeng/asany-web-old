import React, { useCallback, useState } from 'react';
import { Select, Tag } from 'antd';
import scalars from './scalars.json';

const { CheckableTag } = Tag;

type FileType = {
  name: string;
  type: 'SCALAR' | 'REF' | 'ARRAY';
};

const objectType: FileType = {
  name: 'Object',
  type: 'REF',
};
const arrayType: FileType = {
  name: 'Array',
  type: 'ARRAY',
};

function TypeSelector() {
  const [types] = useState<FileType[]>([objectType, arrayType, ...scalars]);
  const [arrayTypes] = useState<FileType[]>([objectType, ...scalars]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const handleCheck = useCallback(
    (type: string) =>
      useCallback((checked: boolean) => {
        if (checked) {
          setCheckedKeys([type]);
        }
      }, []),
    []
  );

  const handleChangeArrayTypeOf = useCallback(
    (type: string) => (checked: boolean) => {
      if (checked) {
        setCheckedKeys([arrayType.name, type]);
      }
    },
    []
  );

  return (
    <>
      <div className="gse_row_details_section">
        <div className="gse_row_details_section_name">类型</div>
        <div style={{ marginLeft: -6 }} className="gse_row_details_section_items">
          {types.map((type) => (
            <CheckableTag
              key={`all_typeof_${type.name}`}
              className={'gse_data_type_' + type.name.toLowerCase()}
              checked={checkedKeys[0] == type.name}
              onChange={handleCheck(type.name)}
            >
              {type.name}
            </CheckableTag>
          ))}
        </div>
      </div>
      {checkedKeys.includes(arrayType.name) && (
        <div className="gse_row_details_section">
          <div className="gse_row_details_section_name">数组项类型</div>
          <div style={{ marginLeft: -6 }} className="gse_row_details_section_items">
            {arrayTypes.map((type) => (
              <CheckableTag
                key={`array_typeof_${type.name}`}
                className={'gse_data_type_' + type.name.toLowerCase()}
                checked={checkedKeys.length > 1 && checkedKeys[1] == type.name}
                onChange={handleChangeArrayTypeOf(type.name)}
              >
                {type.name}
              </CheckableTag>
            ))}
          </div>
        </div>
      )}
      {checkedKeys.includes(objectType.name) && (
        <div className="gse_row_details_section">
          <div className="gse_row_details_section_name">引用类型</div>
          <div style={{ marginLeft: -2 }} className="gse_row_details_section_items">
            <Select size="middle">
              <Select.Option>ssdf</Select.Option>
              <Select.Option>222</Select.Option>
            </Select>
          </div>
        </div>
      )}
    </>
  );
}

export default TypeSelector;
