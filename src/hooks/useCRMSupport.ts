import { useContext } from "react";
import { CRMSupportContext } from "@/providers/SupportProvider";

export function useCRMSupport() {
  const context = useContext(CRMSupportContext);
  if (!context) {
    throw new Error("useCRMSupport must be used within a SupportProvider");
  }
  return context;
}

export default useCRMSupport;
