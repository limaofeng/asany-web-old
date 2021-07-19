import React from "react";
import { Anchor } from "antd";

const { Link } = Anchor;
interface AnchorProps {
    interfaceValue: any;
}
function AnchorComponent(props: AnchorProps) {
    const {interfaceValue} = props;
    return (
        <Anchor>
            {
                interfaceValue.map((item: any, index: number) => {
                    return item.id ? (<Link href={`#${item.id}`} title={item.title} key={index} />) : ''
                })
            }
        </Anchor>
    );
};

export default AnchorComponent;
