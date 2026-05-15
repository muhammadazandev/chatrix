import { RiArrowLeftLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import IconsWrapper from "../../../../../utils/IconsWrapper";

const Appearance = () => {
  const navigate = useNavigate();

  return (
    <div className="pointer-events-auto bg-(--bg-primary) h-[95vh] w-full absolute top-0 left-0 z-50">
      <button className="p-2.5 rounded-full" onClick={() => navigate(-1)}>
        <IconsWrapper icon={RiArrowLeftLine} />
      </button>
    </div>
  );
};

export default Appearance;
