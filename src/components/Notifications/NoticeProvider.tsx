import React, { createContext, useMemo, useState } from "react";
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

type NoticeContextTypes = { addNotice: (data: noticeType) => void };

export const NoticeContext = createContext<NoticeContextTypes>({ addNotice: (arg) => {} });

let keyCounter = 0;
const contextValue = {} as NoticeContextTypes;
export const NoticeProvider = ({ children }: { children: JSX.Element }) => {
  const [notifications, setNotifications] = useState<storeNoticeType[]>([]);

  const addNotice = (data: noticeType) => {
    const newNotice = { key: `${keyCounter}`, ...data };
    keyCounter++;

    setNotifications((prev) => [...prev, newNotice]);
  };

  const memoChildren = useMemo(() => children, [children]);

  contextValue.addNotice = addNotice;

  return (
    <NoticeContext.Provider value={contextValue}>
      {memoChildren}
      <Notifications {...{ notifications, setNotifications }} />
    </NoticeContext.Provider>
  );
};
