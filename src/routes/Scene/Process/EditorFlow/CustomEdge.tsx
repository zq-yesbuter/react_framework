import React from "react";
import { RegisterEdge } from "gg-editor";

class CustomEdge extends React.Component {
  render() {
    const config = {
      getStyle(item) {
        const model = item.getModel();
        const { color, size } = model;

        return {
          stroke: color || "#A3B1BF",
          lineWidth: size || 5
        };
      }
    };

    return (
      <RegisterEdge name="custom-edge" config={config} extend={"flow-smooth"} />
    );
  }
}

export default CustomEdge;
