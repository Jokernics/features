import React, { useState } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import "./index.css";
import { ReactComponent as CloseIcon } from "./close-circle-outline.svg";
import { useDebounceUnmount } from "../../hooks/useDebounceUnmount";

interface props extends React.HTMLProps<HTMLImageElement> {
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  clickScaleStep?: number;
  scrollScaleStep?: number;
}

let isMouseDrag = false;
let isMouseDown = false;

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
  const { mounted } = useDebounceUnmount({ opened: isModalView });
  const [scale, setScale] = useState(initialScale);
  const [imageCords, setImageCords] = useState({ top: 0, left: 0 });
  const contanerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

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

  const onContainerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target;

    if (!closeBtnRef.current || !(target instanceof Node)) return;

    if (target.contains(contanerRef.current) || closeBtnRef.current.contains(target)) {
      setIsModalView(false);
      isMouseDrag = false;
      isMouseDown = false;
    }
  };

  const onMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const dir = Math.sign(e.deltaY);

    changeWheelScale(dir);
  };

  const onMouseMove = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isMouseDown) return;

    isMouseDrag = true;

    const { movementX, movementY } = e;

    let top = imageCords.top + movementY;
    let left = imageCords.left + movementX;

    setImageCords({ left, top });
  };

  const onMouseDown = () => {
    isMouseDown = true;
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  const onModalImageClick = () => {
    if (!isMouseDrag) handleClickScale();

    isMouseDrag = false;
  };

  return (
    <>
      {mounted &&
        createPortal(
          <div
            ref={contanerRef}
            onClick={onContainerClick}
            className={`modal z-[1] ${!isModalView ? "hidden" : ""}`.trim()}
            onWheel={onMouseWheel}
            onMouseMove={onMouseMove}
          >
            <button ref={closeBtnRef} className="absolute top-1 right-1 cursor-pointer hover:scale-105 transition-all z-10">
              <CloseIcon className="w-9 h-9 fill-brand-blue hover:fill-dark-blue" />
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
              <img draggable="false" className="select-none cursor-grabbing" src={src} alt={alt} />
            </div>
          </div>,
          document.body
        )}
      <img onClick={handlePreviewClick} {...{ src, alt, style, className }} />
    </>
  );
}
