import FriendList from "./FriendLists/FriendList";
import FriendRequests from "./FriendRequests/FriendRequests";
import Blocked from "./Blocked/Blocked";
import Settings from "./Settings/Settings";
import ConversationLists from "./ConversationLists/ConversationLists";
import Profile from "./Profile/Profile";
import CreateGroup from "./CreateGroup/CreateGroup";
import ConversationInfo from "./ConversationInfo/ConversationInfo";

const SIDEBAR_VIEWS = {
  friends: FriendList,
  requests: FriendRequests,
  blocked: Blocked,
  settings: Settings,
  conversation: ConversationLists,
  profile: Profile,
  "create-group": CreateGroup,
  "conversation-info": ConversationInfo,
};

const SidebarViewRenderer = ({ currentView }) => {
  const ActiveView = SIDEBAR_VIEWS[currentView];

  if (!ActiveView) {
    return <div>Select a view</div>;
  }

  return <ActiveView />;
};

export default SidebarViewRenderer;
