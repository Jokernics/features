import { useContext, useRef } from "react";
import "./App.css";
import { NoticeContext, NoticeProvider } from "./components/Notifications/NoticeProvider";

function App() {
  return (
    <NoticeProvider>
      <div className="flex flex-col overflow-auto h-screen px-4 py-2">
        <label>
          <h5>Notifications</h5>
          <NoticeTestComp />
        </label>
      </div>
    </NoticeProvider>
  );
}

export default App;

const NoticeTestComp = () => {
  const notificationInputRef = useRef<null | HTMLInputElement>(null);
  const { addNotice } = useContext(NoticeContext);

  return (
    <div>
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
};
