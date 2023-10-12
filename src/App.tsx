import "./App.css";
import ButtonExample from "./components/Examples/ButtonExample";
import ContextMenuExample2 from "./components/Examples/ContextMenuExample2";
import FileInputExample from "./components/Examples/FileInputExample";
import ImageWithZoomExample from "./components/Examples/ImageWithZoomExample";
import NoticeExample from "./components/Examples/NoticeExample";
import TipExample from "./components/Examples/TipExample";
import VerticalSliderExample from "./components/Examples/VerticalSliderExample";
import { NoticeProvider } from "./components/Notifications/NoticeProvider";
import Tip from "./components/Tip/Tip";

function App() {
  return (
    <NoticeProvider>
      <div className="flex flex-col overflow-auto h-screen px-4 py-2 gap-4">
        <NoticeExample />
        <VerticalSliderExample />
        {/* <Tip tipContent={'sdfsdf'}><ButtonExample /></Tip> */}
        <ImageWithZoomExample />
        {/* <ContextMenuExample /> */}
        {/* <TipExample /> */}
        {/* <FileInputExample /> */}
        {/* <ContextMenuExample2 /> */}
      </div>
    </NoticeProvider>
  );
}

export default App;
