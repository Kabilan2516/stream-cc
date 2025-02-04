import { convertProtocolToWs, isBrowser, isBun, isNode } from "./helpers";
import { version } from "./version";
export const NODE_VERSION =
  typeof process !== "undefined" && process.versions && process.versions.node
    ? process.versions.node
    : "unknown";
export const BUN_VERSION =
  typeof process !== "undefined" && process.versions && process.versions.bun
    ? process.versions.bun
    : "unknown";
export const BROWSER_AGENT =
  typeof window !== "undefined" &&
  window.navigator &&
  window.navigator.userAgent
    ? window.navigator.userAgent
    : "unknown";
const getAgent = () => {
  if (isNode()) {
    return `node/${NODE_VERSION}`;
  } else if (isBun()) {
    return `bun/${BUN_VERSION}`;
  } else if (isBrowser()) {
    return `javascript ${BROWSER_AGENT}`;
  } else {
    return `unknown`;
  }
};
export const DEFAULT_HEADERS = {
  "Content-Type": `application/json`,
  "X-Client-Info": `@deepgram/sdk; ${
    isBrowser() ? "browser" : "server"
  }; v${version}`,
  "User-Agent": `@deepgram/sdk/${version} ${getAgent()}`,
};
export const DEFAULT_URL = "https://api.deepgram.com";
export const DEFAULT_GLOBAL_OPTIONS = {
  fetch: { options: { url: DEFAULT_URL, headers: DEFAULT_HEADERS } },
  websocket: {
    options: {
      url: convertProtocolToWs(DEFAULT_URL),
      _nodeOnlyHeaders: DEFAULT_HEADERS,
    },
  },
};
export const DEFAULT_OPTIONS = {
  global: DEFAULT_GLOBAL_OPTIONS,
};
export var SOCKET_STATES;
(function (SOCKET_STATES) {
  SOCKET_STATES[(SOCKET_STATES["connecting"] = 0)] = "connecting";
  SOCKET_STATES[(SOCKET_STATES["open"] = 1)] = "open";
  SOCKET_STATES[(SOCKET_STATES["closing"] = 2)] = "closing";
  SOCKET_STATES[(SOCKET_STATES["closed"] = 3)] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));
export var CONNECTION_STATE;
(function (CONNECTION_STATE) {
  CONNECTION_STATE["Connecting"] = "connecting";
  CONNECTION_STATE["Open"] = "open";
  CONNECTION_STATE["Closing"] = "closing";
  CONNECTION_STATE["Closed"] = "closed";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));
//# sourceMappingURL=constants.js.map
