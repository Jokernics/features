import useTip from "../../hooks/useTip";
import ImageWithZoomModalView from "../ImageWithFullModalView/ImageWithZoomModalView";

export default function ImageWithZoomExample() {
  const { Tip, contentRef } = useTip({ tipText: "Надеко ТЯЯЯЯН" });

  return (
    <div className="w-fit">
      <div ref={contentRef}>
        <Tip />
        <ImageWithZoomModalView
          src="https://shikimori.me/uploads/poster/characters/22050/main_2x-a798062252ba8bd09937d5ed93bd4f84.webp"
          className="h-60"
          initialScale={0.8}
          minScale={0.2}
        />
      </div>
    </div>
  );
}
