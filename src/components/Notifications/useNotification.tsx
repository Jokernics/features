import { useRef, useState } from "react";

let keyCounter = 0;

export interface noticeType {
  value: string | JSX.Element;
  expireTimer?: number;
}

export interface storeNoticeType extends noticeType {
  key: string;
}

const example = {
  key: "dasda",
  value: (
    <div>
      <h5>
        <span className="text-blue-100">Внимание </span>Ту-туру
      </h5>
    </div>
  ),
  expireTimer: 2000,
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState<storeNoticeType[]>([example]);

  const addNotice = (data: noticeType) => {
    const newNotice = { key: `${keyCounter}`, ...data };
    keyCounter++;

    setNotifications((prev) => [...prev, newNotice]);
  };

  return { notifications, addNotice, setNotifications };
};
