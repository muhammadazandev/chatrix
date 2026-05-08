import { AnimatePresence } from "motion/react";
import MoreOptions from "./MoreOptions";
import { useState } from "react";
import { RiMore2Fill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";

const Header = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <header
      className="w-full flex justify-between"
    >
      <h2 className="text-2xl">Chatrix</h2>

      <button
        className="p-2 rounded-full"
        onClick={() => setIsMoreOpen(!isMoreOpen)}
        onBlur={() => setIsMoreOpen(false)}
      >
        <IconsWrapper icon={RiMore2Fill} size={24} />
      </button>

      <AnimatePresence>
        {isMoreOpen && (
          <MoreOptions isMoreOpen={isMoreOpen} setIsMoreOpen={setIsMoreOpen} />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
