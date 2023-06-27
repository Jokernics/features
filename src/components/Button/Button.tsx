import { ReactElement, useEffect, useRef, useState } from "react";
import Loader from "../Loader/Loader";
import { ReactComponent as ArrowIcon } from "../../assets/svg/arrow.svg";
import "./index.css";

type props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: string | ReactElement;
  className?: string;
  style?: {};
  isLoading?: boolean;
  isSuccess?: boolean;
  successArrowExpireTime?: number;
};

export default function Button({
  onClick = () => {},
  children,
  className,
  style = {},
  isLoading = false,
  isSuccess = false,
  successArrowExpireTime = 2000,
}: props) {
  const [isSuccessArrow, setIsSuccessArrow] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setIsSuccessArrow(true);

      timer.current = setTimeout(() => {
        setIsSuccessArrow(false);
      }, successArrowExpireTime);
    } else {
      setIsSuccessArrow(false);

      if (timer.current) {
        clearTimeout(timer.current);
      }
    }
  }, [isSuccess, successArrowExpireTime]);

  return (
    <button
      style={style}
      onClick={(e) => !isLoading && !isSuccessArrow && onClick(e)}
      className={`relative rounded wrap min-h-[2.3rem] w-full max-w-fit min-w-[5rem] whitespace-break-spaces break-all text-black flex justify-center items-center bg-slate-200 px-2 hover:bg-slate-500 transition-all
        
      ${className ? className : ""}`}
    >
      {isLoading && <div className="absolute flex items-center">{<Loader />}</div>}
      {isSuccessArrow && (
        <p className="absolute">
          <ArrowIcon style={{ animationDuration: ".8s" }} className="mx-auto overflow-hidden fadeIn fill-black" />
        </p>
      )}
      <p className={`${isLoading || isSuccessArrow ? "invisible" : ""} ${!isSuccessArrow && isSuccess ? "fadeIn" : ""}`}>
        {children}
      </p>
    </button>
  );
}
