"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupportWidget, useTradeUIStore } from "@/store";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  createContext,
} from "react";

export const CRMSupportContext = createContext<{
  openMetaCRM: () => void;
  widget?: SupportWidget;
  isOpen: boolean;
} | null>(null);

export function SupportProvider({ children }: { children: ReactNode }) {
  const [widget, setWidget] = [
    useTradeUIStore.supportWidget(),
    useTradeUIStore.assignSupportWidget(),
  ];
  const [isOpen, setIsOpen] = [
    useTradeUIStore.supportOpen(),
    useTradeUIStore.setSupportOpen(),
  ];

  const [openWaiting, setOpenWaiting] = useState(false);
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!widget) return;
    if (widget.manualConnectWallet) {
      widget.manualConnectWallet(publicKey?.toString());
    }

    const handleConnectWidget = () => {
      widget.manualConnectWallet(publicKey?.toString());
    };
    document.addEventListener("MetaCRMLoaded", handleConnectWidget);
    return () => {
      document.removeEventListener("MetaCRMLoaded", handleConnectWidget);
    };
  }, [publicKey, widget]);

  const assignWidget = useCallback(
    (attempts = 0) => {
      const w = (window as any).MetaCRMWidget;
      if (w && w.setHide) {
        setWidget(w);
        setIsOpen(true);
        w.setHide(false);
      } else if (attempts < 40) {
        setTimeout(() => assignWidget(attempts + 1), 50);
      }
    },
    [setIsOpen, setWidget]
  );

  const dispatchMetaCRMEvent = useCallback(() => {
    const event = new CustomEvent("MetaCRMInit", {});
    document.dispatchEvent(event);
    assignWidget();
  }, [assignWidget]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("darkened-overlay");
    } else {
      document.body.classList.remove("darkened-overlay");
    }
  }, [isOpen]);

  useEffect(() => {
    if (openWaiting && publicKey) {
      dispatchMetaCRMEvent();
      setIsOpen(true);
      setOpenWaiting(false);
    }
  }, [publicKey, openWaiting, dispatchMetaCRMEvent, setIsOpen]);

  const openMetaCRM = useCallback(() => {
    if (widget && widget.setHide) {
      widget.setHide(false);
      setIsOpen(true);
    } else if ((window as any).MetaCRMWidget) {
      dispatchMetaCRMEvent();
    }
  }, [dispatchMetaCRMEvent, setIsOpen, widget]);

  const closeCRM = useCallback(() => {
    if (widget && isOpen) {
      //   widget.setHide(true); // this works
      widget.setWidgetClose(); // this doesnt
      setIsOpen(false);
    }
  }, [isOpen, setIsOpen, widget]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", closeCRM);
    }
    return () => {
      document.removeEventListener("mousedown", closeCRM);
    };
  }, [isOpen, closeCRM]);

  const contextValue = {
    openMetaCRM,
    widget,
    isOpen,
  };

  return (
    <CRMSupportContext.Provider value={contextValue}>
      {children}
    </CRMSupportContext.Provider>
  );
}
