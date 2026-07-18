import Motion from "../../../../motion/Motion";
import { fade } from "../../../../motion/variants";

const MediaViewer = () => {
  return (
    <Motion
      variants={fade}
      className="overflow-hidden absolute top-0 left-0 min-w-full min-h-full bg-(--bg-primary) z-50 p-5 flex flex-col"
      transition="subtle"
    ></Motion>
  );
};

export default MediaViewer;
