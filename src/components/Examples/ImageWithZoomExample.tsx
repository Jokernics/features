import ImageWithZoomModalView from "../ImageWithFullModalView/ImageWithZoomModalView";
import Tip from "../Tip/Tip";

export default function ImageWithZoomExample() {
  return (
    <div className="w-fit">
      <div >
        <Tip tipContent={"Надеко ТЯЯЯЯН"}>
          <ImageWithZoomModalView
            src="https://99px.ru/sstorage/53/2018/08/tmb_233526_520918.png"
            className="h-60"
            initialScale={0.8}
            minScale={0.2}
          />
        </Tip>
      </div>
    </div>
  );
}
