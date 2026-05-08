import FriendList from "./FriendLists/FriendList";
import FriendRequests from "./FriendRequests/FriendRequests";
import Blocked from "./Blocked/Blocked";
import Settings from "./Settings/Settings";

const SIDEBAR_VIEWS = {
  friends: FriendList,
  requests: FriendRequests,
  blocked: Blocked,
  settings: Settings,
};

const SidebarViewRenderer = ({ currentView }) => {
  const ActiveView = SIDEBAR_VIEWS[currentView];

  if (!ActiveView) {
    return <div>Select a view</div>;
  }

  return <ActiveView />;
};

export default SidebarViewRenderer;
