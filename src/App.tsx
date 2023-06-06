import { useRef } from "react";
import "./App.css";
import Notifications from "./components/Notifications/Notifications";
import { useNotification } from "./components/Notifications/useNotification";

function App() {
  const { notifications, setNotifications, addNotice } = useNotification();
  const notificationInputRef = useRef<null | HTMLInputElement>(null);

  return (
    <div className="flex flex-col  overflow-auto h-screen px-4 py-2">
      <label>
        <h5>Notivications</h5>
        <div>
          <input type="text" ref={notificationInputRef} className="border-red-400 outline-red-400  border rounded-md mr-2 mt-2 px-2 py-1"/>
          <button
            onClick={() => {
              if (notificationInputRef.current) addNotice(notificationInputRef.current.value);
            }}
          >
            Send
          </button>
        </div>
        <Notifications {...{ notifications, setNotifications }} />
      </label>
    </div>
  );
}

export default App;
