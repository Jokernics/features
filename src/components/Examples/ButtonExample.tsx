import React, { useState } from "react";
import Button from "../Button/Button";

export default function ButtonExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setIsSuccess(false);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div>
      <Button {...{ isLoading, isSuccess }} onClick={handleClick}>
        button
      </Button>
    </div>
  );
}
