import React, { memo, useState } from "react";
import "./index.css";
import { storeNoticeType } from "./useNotification";

type props = {
  notice: storeNoticeType;
  setNotifications: React.Dispatch<React.SetStateAction<storeNoticeType[]>>;
};

export default memo(function Notification({ notice, setNotifications }: props) {
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
      <div className={`border-cyan-300 bg-gray-400 rounded-md px-4 py-2 mb-2 relative w-fit min-w-[10rem] max-w-[250px] h-fit`}>
        <div style={{overflowWrap: 'break-word'}} className="wrap">{notice.value}</div>
        <button onClick={deleteNotice} className="absolute -top-1 right-1">
          x
        </button>
      </div>
    </div>
  );
});
