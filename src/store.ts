import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { StoreApi, UseBoundStore } from "zustand";

type Selectors<S> = S extends { getState: () => infer T }
  ? { [K in keyof Required<T>]: () => T[K] }
  : never;

export const selectors = <S extends UseBoundStore<StoreApi<object>>>(
  store: S
) => {
  const selectors = {} as Record<string, () => unknown>;
  for (const k of Object.keys(store.getState())) {
    selectors[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return selectors as Selectors<S>;
};

export type SupportWidget = {
  setHide: (h: boolean) => void;
  manualConnectWallet: (publicKey?: string) => void;
  setWidgetOpen: () => void;
  setWidgetClose: () => void;
};

export type TradeUIStates = {
  supportOpen: boolean;
  supportWidget?: SupportWidget;
};

export type TradeUIActions = {
  setSupportOpen: (open: boolean) => void;
  assignSupportWidget: (widget: SupportWidget) => void;
};

export type TradeUISlice = TradeUIStates & TradeUIActions;

const DEFAULT_STATES: TradeUIStates = {
  supportOpen: false,
  supportWidget: undefined,
};

export const useTradeUIStore = selectors(
  create<TradeUISlice>()(
    persist(
      immer<TradeUISlice>((set) => ({
        ...DEFAULT_STATES,
        setSupportOpen: (open: boolean) =>
          set((state) => {
            state.supportOpen = open;
          }),
        assignSupportWidget: (widget: SupportWidget) =>
          set((state) => {
            state.supportWidget = widget;
          }),
      })),
      {
        name: "trade-ui-store",
        version: 2,
        partialize: (state) => {
          return {
            supportOpen: state.supportOpen,
            supportWidget: state.supportWidget,
          };
        },
      }
    )
  )
);
