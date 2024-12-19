"use client";
import useCRMSupport from "@/hooks/useCRMSupport";
export const Content = () => {
  const { openMetaCRM } = useCRMSupport();
  return (
    <div>
      <button onClick={openMetaCRM}>support</button>
    </div>
  );
};
