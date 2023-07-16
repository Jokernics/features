import React, { memo, useState } from "react";
import "./index.css";
import { storeNoticeType } from "./NoticeProvider";
import { ReactComponent as CloseIcon } from './closeCross.svg'

type props = {
  notice: storeNoticeType;
  setNotifications: React.Dispatch<React.SetStateAction<storeNoticeType[]>>;
  maxWidth?: string;
};

export default memo(function Notification({ notice, setNotifications, maxWidth }: props) {
  const [animation, setAnimation] = useState("fadeIn");

  const deleteNotice = () => {
    setAnimation("fadeOut");
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "fadeOut") {
      setNotifications((prev) => prev.filter((e) => e.key !== notice.key));
    } else if (e.animationName === "fadeIn" && notice.expireTimer) {
      setTimeout(() => {
        deleteNotice();
      }, notice.expireTimer);
    }
  };

  return (
    <div className={`${animation}`} onAnimationEnd={handleAnimationEnd}>
      <div
        style={{ maxWidth: maxWidth || "80vw" }}
        className={`relative min-h-[2rem] border-cyan-300 bg-gray-400 rounded-md px-4 py-2 mb-2 w-fit min-w-[10rem] h-fit`}
      >
        <div style={{ overflowWrap: "break-word" }} className="wrap">
          {notice.value}
        </div>
        <CloseIcon onClick={deleteNotice} className="w-3 h-3 cursor-pointer absolute top-[2px] right-[2px]" />
      </div>
    </div>
  );
});
