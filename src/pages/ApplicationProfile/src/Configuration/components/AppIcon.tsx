import * as React from 'react';
import Image from '../../components/Image';
import {Uploader} from '@asany/components';

interface AppIconProps {
  value?: string;
  onChange?: (value: string) => any;
  style?: React.CSSProperties;
}

function AppIcon(props: AppIconProps) {
  const { value, style, onChange } = props;

  const handleChange = async (img: any) => {
    const imgUrl = img?.url ?? img?.value ?? ''
    if (onChange) {
      await onChange(imgUrl);
    }
  };

  return (
    <div style={style}>
      <Uploader
        callBackMode='file'
        style={{ boxSizing: 'border-box' }}
        options={{ size: '102x102' }}
        mode="image"
        value={{
          uid: Date.now(),
          url: value
        }}
        onChange={handleChange}
      />
      <Image src={value!} size="84x84" style={{ margin: '0 8px 8px 0' }}/>
      <Image src={value!} size="72x72" style={{ margin: '0 8px 8px 0' }}/>
      <Image src={value!} size="62x62" style={{ margin: '0 8px 8px 0' }}/>
      <Image src={value!} size="52x52" style={{ margin: '0 8px 8px 0' }}/>
      <Image src={value!} size="40x40" style={{ margin: '0 8px 8px 0' }}/>
      <Image src={value!} size="25x25" style={{ margin: '0 8px 8px 0' }}/>
    </div>
  );
}

export default AppIcon;
