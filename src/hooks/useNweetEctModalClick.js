import { useEffect, useState } from "react";

export const useNweetEctModalClick = (etcRef) => {
  const [nweetEtc, setNweetEtc] = useState(false);

  useEffect(() => {
    // nweetEct가 true면 return;으로 인해 함수 종료(렌더 후 클릭 시 에러 방지)
    if (!nweetEtc) return;

    const handleClick = (e) => {
      if (!etcRef.current.contains(e.target)) {
        setNweetEtc(false);
      } else if (etcRef.current === null) {
        return;
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [etcRef, nweetEtc]);

  return { nweetEtc, setNweetEtc };
};
