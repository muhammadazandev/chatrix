import { RiArrowLeftLine } from "@remixicon/react";
import IconsWrapper from "../../../../../../components/IconsWrapper";
import Theme from "./Theme";
import AccentColor from "./AccentColor";
import AnimationSettings from "./AnimationSettings";
import { useQueryParams } from "../../../../../../hooks/useQueryParams";

const Appearance = () => {
  const { updateParams } = useQueryParams();

  return (
    <div className="pointer-events-auto bg-(--bg-primary) h-[95vh] w-full absolute top-0 left-0 z-50">
      <button
        className="p-2.5 rounded-full"
        onClick={() => updateParams({ tab: null })}
      >
        <IconsWrapper icon={RiArrowLeftLine} />
      </button>

      <div className="flex flex-col gap-8 pt-8">
        <Theme />
        <AccentColor />
        <AnimationSettings />
      </div>
    </div>
  );
};

export default Appearance;
