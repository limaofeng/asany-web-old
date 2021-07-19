import React from 'react';
import { AsanyEditor,sketch } from '@asany/components';
import { AsanyProject } from '@asany/components/lib/asany-editor/typings';
import { BlockContext } from '@asany/components/es/asany-editor/hooks/useBlock';
import { Drawer } from 'antd';
import './style/index.less';

interface ComponentStatus {
  template: string;
  name?: string;
  props?: any;
}

interface ComponentSketchProps {
  id?: string;
  visible: boolean;
  componentInfo: ComponentStatus;
  onChange?: (data: any) => void;
  onClose: () => void;

  [key: string]: any;
}

function getProject(componentInfo: ComponentStatus): AsanyProject {
  return {
    name: componentInfo.name,
    type: 'component',
    data: {
      id: componentInfo.template,
      props: componentInfo.props,
    },
  } as AsanyProject;
}

function ComponentSketch(props: ComponentSketchProps): JSX.Element {
  const { visible, componentInfo, onClose, onChange } = props;
  let project: AsanyProject = {} as AsanyProject;

  if (componentInfo) {
    project = getProject(componentInfo);
  }
  const handleComponentChange = (data: any) => {
    console.log('我是回带数据', data);
    const componentData = {
      ...data,
      data: {
        template: data.data.id,
        props: data.data.props,
      },
    };
    if (onChange) {
      onChange(componentData);
    }
  };
  console.log('我是进入的数据', project);
  return (
    <Drawer
      visible={visible}
      className="sketch-drawer"
      width="100%"
      placement="left"
      onClose={onClose}
    >
      <BlockContext.Provider value={{ parentBlockKey: '' }}>
        {visible && (
          <AsanyEditor
            template={componentInfo.template}
            project={{ ...project }}
            onBack={onClose}
            onSave={handleComponentChange}
            plugins={[sketch]}
          />
        )}
      </BlockContext.Provider>
    </Drawer>
  );
}

export default ComponentSketch;
