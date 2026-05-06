import { motion } from "motion/react";

const views = [
  { id: "friends", label: "Friends" },
  { id: "requests", label: "Friend Requests" },
  { id: "blocked", label: "Blocked" },
];

const Views = ({ currentView, setCurrentView }) => {
  return (
    <motion.div
      className="flex gap-4 overflow-auto mt-4 -z-10"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {views.map((view) => {
        return (
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm border border-(--foreground-primary)/50 opacity-90 text-nowrap ${view.id === currentView ? "bg-(--accent-color-primary)/15 no-hover hover:bg-(--accent-color-primary)/25" : ""}`}
            onClick={() => {
              setCurrentView(view.id);
            }}
            key={view.id}
          >
            {view.label}
          </button>
        );
      })}
    </motion.div>
  );
};

export default Views;
