import "./App.css";
import { AyubDynamicHeight } from "./components/Examples/AyubVirtualization";
import FileInputExample from "./components/Examples/FileInputExample";
import LargeListExample from "./components/Examples/LargeListExample";
import LargeListExampleRefactor from "./components/Examples/LargeListExampleRefactor";
import NoticeExample from "./components/Examples/NoticeExample";
import { NoticeProvider } from "./components/Notifications/NoticeProvider";
import RowVirtualizerDynamic from "./components/TanstackVirtualized";
import { TestComponent } from "./TestComponent";

function App() {
  return (
    <NoticeProvider>
      <div className="flex flex-col overflow-auto w-screen h-screen px-4 py-2 gap-4">
        <div className="flex gap-6 w-40 border">
          <div className="overflow-auto flex-[1_1_0] w-0">1234356789</div>
          <div className="overflow-auto flex-[1_1_0] w-0">123456</div>
        </div>n
        <TestComponent />
        {/* <SomeExample/> */}
        {/* <SomeExample2/> */}
        {/* <LargeListExample />  */}
        {/* <AyubDynamicHeight/> */}
        {/* <LargeListExampleRefactor/> */}
        {/* <RowVirtualizerDynamic/> */}
        {/* <NoticeExample /> */}
        {/* <VerticalSliderExample /> */}
        {/* <Tip tipContent={'sdfsdf'}><ButtonExample /></Tip> */}
      {/* <ImageWithZoomExample /> */}
        {/* <ContextMenuExample /> */}
        {/* <TipExample /> */}
       <FileInputExample /> 
        {/* <ContextMenuExample2 /> */}
        <div style={{height: '1000px', flexShrink: 0}}>sd</div>
        <textarea defaultValue={232} style={{border: '1px solid black', flexShrink: 0}}  />
      <div style={{height: '1000px', flexShrink: 0}}>sd</div>

      </div>

    </NoticeProvider>
  );
}

export default App;
