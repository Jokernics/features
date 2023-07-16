import ImageWithZoomModalView from "../ImageWithFullModalView/ImageWithZoomModalView";
import Tip from "../Tip/Tip";

export default function ImageWithZoomExample() {
  return (
    <div className="w-fit">
      <Tip
        tipContent='Надеко ТЯЯЯЯН'
      >
        <ImageWithZoomModalView
          src="https://shikimori.me/uploads/poster/characters/22050/main_2x-a798062252ba8bd09937d5ed93bd4f84.webp"
          className="h-60"
          initialScale={0.8}
          minScale={0.2}
        />
      </Tip
      >
    </div>
  );
}