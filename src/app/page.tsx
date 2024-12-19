"use client";
import { WalletProvider } from "@solana/wallet-adapter-react";
import styles from "./page.module.css";
import { SupportProvider } from "@/providers/SupportProvider";
import { Content } from "./content";

export default function Home() {
  return (
    <div
      className={styles.page}
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #e0e0e0, #808080)",
      }}
    >
      <WalletProvider wallets={[]}>
        <SupportProvider>
          <Content />
        </SupportProvider>
      </WalletProvider>
    </div>
  );
}
