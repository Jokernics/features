import React from "react";
import ImageWithZoomModalView from "../ImageWithFullModalView/ImageWithZoomModalView";

export default function ImageWithZoomExample() {
  return (
    <div>
      <ImageWithZoomModalView 
        src="https://shikimori.me/uploads/poster/characters/22050/main_2x-a798062252ba8bd09937d5ed93bd4f84.webp"
        className="h-60"
      />
    </div>
  );
}
