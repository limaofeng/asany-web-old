import React, { CSSProperties } from 'react';

interface ImageProps {
  src: string;
  size?: string;
  text?: string;
  enableHolder: boolean;
  style?: CSSProperties;
  title?: string;
}

interface ImageState {
  id: string;
}

class Image extends React.PureComponent<ImageProps, ImageState> {
  static defaultProps = {
    enableHolder: false,
  };

  // async componentDidMount() {
  //   if (this.props.enableHolder) {
  //     await sleep(250);
  //     this.handleHolder();
  //   }
  // }

  handleHolder = () => {
    // Holder.run({
    //   themes: {
    //     dark: {
    //       bg: '#fafafa',
    //       fg: '#d9d9d9',
    //       size: 12,
    //       font: 'Monaco',
    //       fontweight: 'normal',
    //     },
    //   },
    //   domain: 'image.holder.js',
    //   images: '#image-view',
    // });
  };

  render() {
    const { size, text = size, src, style = {}, title } = this.props;
    const [width, height] = size!.split('x');
    const props = this.props.enableHolder
      ? { 'data-src': `image.holder.js/${size}?text=${title || text}&theme=dark` }
      : {};
    return (
      <img
        id="image-view"
        alt=""
        style={{
          display: 'block',
          // eslint-disable-next-line radix
          width: parseInt(width),
          // eslint-disable-next-line radix
          height: parseInt(height),
          objectFit: 'cover',
          ...style,
        }}
        src={src}
        {...props}
      />
    );
  }
}

export default Image;
