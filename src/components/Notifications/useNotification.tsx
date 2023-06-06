import { useState } from "react";

let keyCounter = 0;

export type noticeType = {
  value: string;
  key: string;
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState<noticeType[]>([{ key: "dasda", value: "dasdasd" }]);

  const addNotice = (str: string) => {
    const newNotice = { key: `${keyCounter}`, value: str };
    keyCounter++;

    setNotifications((prev) => [newNotice, ...prev]);
  };

  return { notifications, addNotice, setNotifications };
};
