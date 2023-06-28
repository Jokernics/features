import "./App.css";
import ButtonExample from "./components/Examples/ButtonExample";
import ContextMenuExample from "./components/Examples/ContextMenuExample";
import ImageWithZoomExample from "./components/Examples/ImageWithZoomExample";
import NoticeExample from "./components/Examples/NoticeExample";
import { NoticeProvider } from "./components/Notifications/NoticeProvider";

function App() {
  return (
    <NoticeProvider>
      <div className="flex flex-col overflow-auto h-screen px-4 py-2">
        <NoticeExample />
        <ButtonExample />
        <ImageWithZoomExample />
        <ContextMenuExample />
      </div>
    </NoticeProvider>
  );
}

export default App;
