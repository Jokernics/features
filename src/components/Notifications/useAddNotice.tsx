import { useContext } from "react";
import { NoticeContext } from "./NoticeProvider";

export const useAddNotice = () => {
  const { addNotice } = useContext(NoticeContext);

  return addNotice;
};
