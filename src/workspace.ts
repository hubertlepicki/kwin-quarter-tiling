import { Client, ClientSignal } from "./client";
import { Geometry } from "./geometry";

interface ClientFullScreenSignal {
  connect: (cb: (client: Client, fs: boolean) => void) => void;
  disconnect: (cb: (client: Client, fs: boolean) => void) => void;
}

interface ClientMaximizeSignal {
  connect: (cb: (client: Client, h: boolean, v: boolean) => void) => void;
  disconnect: (cb: (client: Client, h: boolean, v: boolean) => void) => void;
}

interface DesktopPresenceChangeSignal {
  connect: (cb: (client: Client, desktop: number) => void) => void;
  disconnect: (cb: (client: Client, desktop: number) => void) => void;
}

interface CurrentDesktopChangedSignal {
  connect: (cb: (desktop: number, client: Client) => void) => void;
  disconnect: (cb: (desktop: number, client: Client) => void) => void;
}

interface NumberDesktopsChangedSignal {
  connect: (cb: (previousDesktops: number) => void) => void;
  disconnect: (cb: (previousDesktops: number) => void) => void;
}

interface ScreenResizedSignal {
  connect: (cb: (screen: number) => void) => void;
  disconnect: (cb: (screen: number) => void) => void;
}

interface NumberScreensChangedSignal {
  connect: (cb: (count: number) => void) => void;
  disconnect: (cb: (count: number) => void) => void;
}

interface Workspace {
  activeClient: Client;
  currentDesktop: number;

  readonly activeScreen: number;
  readonly numScreens: number;
  readonly desktops: number;
  readonly currentActivity: string;

  readonly clientList: () => Array<Client>;
  readonly clientArea: (type: number, screenId: number, desktopId: number) => Geometry;

  readonly clientAdded: ClientSignal;
  readonly clientRemoved: ClientSignal;
  readonly clientActivated: ClientSignal;
  readonly clientUnminimized: ClientSignal;
  readonly clientMinimized: ClientSignal;
  readonly clientMaximizeSet: ClientMaximizeSignal;
  readonly clientFullScreenSet: ClientFullScreenSignal;
  readonly currentDesktopChanged: CurrentDesktopChangedSignal;
  readonly desktopPresenceChanged: DesktopPresenceChangeSignal;
  readonly numberDesktopsChanged: NumberDesktopsChangedSignal;
  readonly screenResized: ScreenResizedSignal;
  readonly numberScreensChanged: NumberScreensChangedSignal;
}

// @ts-ignore, KWin global
export const workspace: Workspace = workspace || {};
