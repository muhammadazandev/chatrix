import { useQueryParams } from "../../../hooks/useQueryParams";

const ViewTabs = ({ currentView }) => {
  const { updateParams } = useQueryParams();

  const viewsButtons = [
    { id: "conversation", label: "Conversation" },
    { id: "friends", label: "Friends" },
    { id: "requests", label: "Friend Requests" },
    { id: "blocked", label: "Blocked" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto w-full mt-4 -z-10 pb-3">
      {viewsButtons.map((view) => {
        return (
          <button
            type="button"
            className={`min-w-fit rounded-full px-4 py-2 text-sm border border-(--foreground-primary)/50 opacity-90 text-nowrap ${view.id === currentView ? "bg-(--accent-color-primary)/15 no-hover hover:bg-(--accent-color-primary)/25" : ""}`}
            onClick={() => {
              updateParams({ view: view.id });
            }}
            key={view.id}
          >
            {view.label}
          </button>
        );
      })}
    </div>
  );
};

export default ViewTabs;
