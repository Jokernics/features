import { createPortal } from "react-dom";
import Notification from "./Notification";
import { noticeType } from "./useNotification";

type props = {
  notifications: noticeType[];
  setNotifications: React.Dispatch<React.SetStateAction<noticeType[]>>;
};

export default function Notifications({ notifications, setNotifications }: props) {
  return (
    <div>
      {createPortal(
        <div className="fixed top-0 right-6 h-full flex flex-col justify-end">
          {notifications.map((notice, index) => {
            return <Notification key={notice.key} notice={notice} setNotifications={setNotifications} />;
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
