import { useEffect, useState } from "react";
import "./index.css";

export default function Loader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isVisible && (
        <span className="loader mx-auto overflow-hidden w-4 h-4"></span>
      )}
    </>
  );
}