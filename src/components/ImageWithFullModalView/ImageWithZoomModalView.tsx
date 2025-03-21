import React, { useState } from "react";
import { useRef } from "react";
import { ReactComponent as CloseIcon } from "./close-circle-outline.svg";
import Modal from "../Modal/Modal";
import { useOutsideClick } from "../../hooks/useOutsideClick";

interface props extends React.HTMLProps<HTMLImageElement> {
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  clickScaleStep?: number;
  scrollScaleStep?: number;
}

export default function ImageWithZoomModalView({
  src,
  alt = "description",
  style = {},
  className = "",
  initialScale = 2,
  minScale = 1,
  maxScale = 2,
  clickScaleStep = 0.6,
  scrollScaleStep = 0.2,
}: props) {
  const [isModalView, setIsModalView] = useState(false);
  const [scale, setScale] = useState(initialScale);
  const [imageCords, setImageCords] = useState({ top: 0, left: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isMouseDrag = useRef(false);
  const isMouseDown = useRef(false);

  const changeWheelScale = (dir: number) => {
    let newScale = scale;

    if (dir === -1) newScale += scrollScaleStep;
    if (dir === 1) newScale -= scrollScaleStep;

    if (newScale >= maxScale || newScale <= minScale) return;

    setScale(newScale);
  };

  const handleClickScale = () => {
    let newScale = scale + clickScaleStep;

    if (newScale > maxScale) newScale = initialScale;

    setScale(newScale);
  };

  const handlePreviewClick = () => {
    setIsModalView(true);
  };

  const onMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const dir = Math.sign(e.deltaY);

    changeWheelScale(dir);
  };

  const onMouseMove = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isMouseDown.current) return;

    isMouseDrag.current = true;

    const { movementX, movementY } = e;

    let top = imageCords.top + movementY;
    let left = imageCords.left + movementX;

    setImageCords({ left, top });
  };

  const onMouseDown = () => {
    isMouseDown.current = true;
  };

  const onMouseUp = () => {
    isMouseDown.current = false;
  };

  const onModalImageClick = () => {
    if (!isMouseDrag.current) handleClickScale();

    isMouseDrag.current = false;
  };

  const handleOutsideClick = () => {
    setIsModalView(false);
    isMouseDrag.current = false;
    isMouseDown.current = false;
  }

  useOutsideClick({ ignoreElements: [imageRef], onOutsideClick: handleOutsideClick })

  return (
    <>
      <Modal onWheel={onMouseWheel} onMouseMove={onMouseMove} open={isModalView}>
        <>
          <button className="absolute top-1 right-1 cursor-pointer hover:scale-105 transition-all z-10">
            <CloseIcon className="w-9 h-9" />
          </button>
          <div
            style={{
              top: imageCords.top,
              left: imageCords.left,
              scale: `${scale}`,
              transition: "scale 0.1s ease-out",
            }}
            className="relative"
            draggable="false"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onClick={onModalImageClick}
          >
            <img ref={imageRef} draggable="false" className="select-none cursor-grabbing" src={src} alt={alt} />
          </div>
        </>
      </Modal>
      <img onClick={handlePreviewClick} {...{ src, alt, style, className }} />
    </>
  );
}
