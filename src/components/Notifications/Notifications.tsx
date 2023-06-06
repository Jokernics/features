import { useEffect, useRef } from "react";
import Notification from "./Notification";
import { storeNoticeType } from "./useNotification";

type props = {
  notifications: storeNoticeType[];
  setNotifications: React.Dispatch<React.SetStateAction<storeNoticeType[]>>;
  maxContainerWidth?: string;
};

export default function Notifications({ notifications, setNotifications }: props) {
  const containerRef = useRef<null | HTMLDivElement>(null);
  const noticePreviousCounter = useRef(notifications.length);

  useEffect(() => {
    const isWasAdded = notifications.length > noticePreviousCounter.current;

    if (containerRef.current && isWasAdded) {
      containerRef.current.scrollTo(0, 100000);
    }

    noticePreviousCounter.current = notifications.length;
  }, [notifications]);

  return (
    <div ref={containerRef} className="fixed bottom-0 right-6 max-h-screen overflow-auto notice-wrapper">
      <div className="flex flex-col justify-end items-end py-2 mt-auto">
        {notifications.map((notice, index) => {
          return <Notification key={notice.key} notice={notice} setNotifications={setNotifications} />;
        })}
      </div>
    </div>
  );
}
