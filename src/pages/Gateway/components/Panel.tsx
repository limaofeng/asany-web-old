import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import React, { CSSProperties, useCallback, useState } from 'react';

interface PanelProps {
  collapse?: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

function Panel(props: PanelProps) {
  const { title, className, collapse, children, style } = props;

  const [expanded, setExpanded] = useState(true);

  const handleCollapse = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <div className="panel" style={style}>
      {title && (
        <div className="panel-heading">
          <div onClick={handleCollapse} className={classnames('panel-title', { 'panel-collapse': collapse })}>
            {collapse && (
              <span className="panel-collapse-icon flex-initial items-center">
                {expanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
              </span>
            )}
            {title}
          </div>
        </div>
      )}
      <div className={classnames('panel-body', { collapse: !expanded }, className)}>{children}</div>
    </div>
  );
}

export default Panel;
