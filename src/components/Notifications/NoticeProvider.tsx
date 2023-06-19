import { createContext, useMemo, useState } from "react";
import Notifications from "./Notifications";

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
        <span className="text-blue-100">Внимание</span> Ту-туру
      </h5>
    </div>
  ),
};

let keyCounter = 0;
export const NoticeContext = createContext<{ addNotice: (data: noticeType) => void }>({ addNotice: (arg) => {} });

export const NoticeProvider = ({ children }: { children: JSX.Element }) => {
  const [notifications, setNotifications] = useState<storeNoticeType[]>([example]);

  const addNotice = (data: noticeType) => {
    const newNotice = { key: `${keyCounter}`, ...data };
    keyCounter++;

    setNotifications((prev) => [...prev, newNotice]);
  };

  const memoChildren = useMemo(() => children, [children]);

  return (
    <NoticeContext.Provider value={{ addNotice }}>
      {memoChildren}
      <Notifications {...{ notifications, setNotifications }} />
    </NoticeContext.Provider>
  );
};
