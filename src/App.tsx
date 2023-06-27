import { useRef } from "react";
import "./App.css";
import { NoticeProvider } from "./components/Notifications/NoticeProvider";
import { useAddNotice } from "./components/Notifications/useAddNotice";
import NoticeExample from "./components/Examples/NoticeExample";
import ButtonExample from "./components/Examples/ButtonExample";

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
  return (
    <div>
      <NoticeExample />
      <ButtonExample />
    </div>
  );
};
