import "./App.css";
import ButtonExample from "./components/Examples/ButtonExample";
import ContextMenuExample from "./components/Examples/ContextMenuExample";
import ContextMenuExample2 from "./components/Examples/ContextMenuExample2";
import FileInputExample from "./components/Examples/FileInputExample";
import ImageWithZoomExample from "./components/Examples/ImageWithZoomExample";
import NoticeExample from "./components/Examples/NoticeExample";
import TipExample from "./components/Examples/TipExample";
import { NoticeProvider } from "./components/Notifications/NoticeProvider";
import DynamicHeightGrid from "./components/ReactVirtualized/ReactVirtualized";
import TanstackVirtualized from "./components/TanstackVirtualized";
import TipPositionHelper from "./components/Tip/TipPositionHelper";

function App() {
  return <TanstackVirtualized />
  return (
    <NoticeProvider>
      <div className="flex flex-col overflow-auto h-screen px-4 py-2 gap-4">
        <NoticeExample />
        <ButtonExample />
        <ImageWithZoomExample />
        {/* <ContextMenuExample /> */}
        <TipExample />
        <FileInputExample />
        <ContextMenuExample2 />\

      </div>
    </NoticeProvider>
  );
}

export default App;
