import "./App.css";
import ButtonExample from "./components/Examples/ButtonExample";
import ContextMenuExample from "./components/Examples/ContextMenuExample";
import FileInputExample from "./components/Examples/FileInputExample";
import ImageWithZoomExample from "./components/Examples/ImageWithZoomExample";
import NoticeExample from "./components/Examples/NoticeExample";
import TipExample from "./components/Examples/TipExample";
import { NoticeProvider } from "./components/Notifications/NoticeProvider";

function App() {
  return (
    <NoticeProvider>
      <div className="flex flex-col overflow-auto h-screen px-4 py-2 gap-4">
        <NoticeExample />
        <ButtonExample />
        <ImageWithZoomExample />
        <ContextMenuExample />
        <TipExample />
        <FileInputExample />
      </div>
    </NoticeProvider>
  );
}

export default App;
