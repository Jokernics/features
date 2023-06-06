import React, { memo, useState } from "react";
import "./index.css";
import { noticeType } from "./useNotification";

type props = {
  notice: noticeType;
  setNotifications: React.Dispatch<React.SetStateAction<noticeType[]>>;
};

export default memo(function Notification({ notice, setNotifications }: props) {
  const [animation, setAnimation] = useState("fadeIn");

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "fadeOut") {
      setNotifications((prev) => prev.filter((e) => e.key !== notice.key));
    }
  };

  return (
    <div className={`${animation}`} onAnimationEnd={handleAnimationEnd}>
      <div className={`border-cyan-300 bg-gray-400 rounded-md px-4 py-2 mb-2 relative`}>
        <p>{notice.value}</p>
        <button
          onClick={() => {
            setAnimation("fadeOut");
          }}
          className="absolute -top-1 right-1"
        >
          x
        </button>
      </div>
    </div>
  );
});
