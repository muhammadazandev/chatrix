import { animateFill } from "tippy.js";
import Tippy from "@tippyjs/react";

const Tooltip = ({ children, content, delay = 50 }) => {
  return (
    <Tippy
      content={content}
      animateFill={true}
      plugins={[animateFill]}
      placement="top"
      delay={delay}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip;
