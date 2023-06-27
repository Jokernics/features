import React, { useRef } from "react";
import { useAddNotice } from "../Notifications/useAddNotice";

export default function NoticeExample() {
  const notificationInputRef = useRef<null | HTMLInputElement>(null);
  const addNotice = useAddNotice();

  return (
    <div>
      {" "}
      <input
        type="text"
        ref={notificationInputRef}
        className="border-red-400 outline-red-400 border rounded-md mr-2 mt-2 px-2 py-1"
      />
      <button
        onClick={() => {
          if (notificationInputRef.current) addNotice({ value: notificationInputRef.current.value });
        }}
      >
        Send
      </button>
    </div>
  );
}
