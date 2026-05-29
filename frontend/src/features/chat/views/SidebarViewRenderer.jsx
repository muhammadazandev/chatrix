import FriendList from "./FriendLists/FriendList";
import FriendRequests from "./FriendRequests/FriendRequests";
import Blocked from "./Blocked/Blocked";
import Settings from "./Settings/Settings";
import ConversationView from "./Conversation/ConversationView";

const SIDEBAR_VIEWS = {
  friends: FriendList,
  requests: FriendRequests,
  blocked: Blocked,
  settings: Settings,
  conversation: ConversationView,
};

const SidebarViewRenderer = ({ currentView }) => {
  const ActiveView = SIDEBAR_VIEWS[currentView];

  if (!ActiveView) {
    return <div>Select a view</div>;
  }

  return <ActiveView />;
};

export default SidebarViewRenderer;
