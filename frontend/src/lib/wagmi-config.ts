/**
 * wagmi-config.ts
 * Configures wagmi for Sepolia + Base Sepolia testnets (free, no mainnet).
 * WalletConnect Project ID is read from env to avoid hardcoding.
 */
import { createConfig, http } from "wagmi";
import { sepolia, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia],
  connectors: [
    injected(), // MetaMask / any injected wallet
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});
