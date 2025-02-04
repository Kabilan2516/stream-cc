import type { DefaultNamespaceOptions, DefaultClientOptions } from "./types";
export declare const NODE_VERSION: string;
export declare const BUN_VERSION: string;
export declare const BROWSER_AGENT: string;
export declare const DEFAULT_HEADERS: {
  "Content-Type": string;
  "X-Client-Info": string;
  "User-Agent": string;
};
export declare const DEFAULT_URL = "https://api.deepgram.com";
export declare const DEFAULT_GLOBAL_OPTIONS: Partial<DefaultNamespaceOptions>;
export declare const DEFAULT_OPTIONS: DefaultClientOptions;
export declare enum SOCKET_STATES {
  connecting = 0,
  open = 1,
  closing = 2,
  closed = 3,
}
export declare enum CONNECTION_STATE {
  Connecting = "connecting",
  Open = "open",
  Closing = "closing",
  Closed = "closed",
}
//# sourceMappingURL=constants.d.ts.map
