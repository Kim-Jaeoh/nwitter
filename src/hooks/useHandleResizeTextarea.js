import { useCallback } from "react";

export const useHandleResizeTextarea = (ref) => {
  // 메세지 글자 수(높이)에 따라 인풋창 크기 조절
  const handleResizeHeight = useCallback(() => {
    if (ref === null || ref.current === null) {
      return;
    }
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, []);

  return handleResizeHeight;
};
