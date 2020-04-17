import { Client } from "./client";
import { Geometry } from "./geometry";
import Toplevel from "./toplevel";
import { config } from "./config";
import { workspace } from "./workspace";

class ToplevelManager {
  toplevels: Array<Array<Toplevel>> = [];

  forEach(callback: (screen: number, desktop: number) => boolean | void): void {
    for (var i = 0; i < workspace.numScreens; i++) {
      for (var j = 1; j <= workspace.desktops; j++) {
        if (this.toplevels[i]?.[j]) {
          const shouldReturn = callback(i, j);
          if (shouldReturn) {
            return;
          }
        }
      }
    }
  }

  forEachScreen(desktop: number, callback: (screen: number, desktop: number) => boolean | void): void {
    for (var i = 0; i < workspace.numScreens; i++) {
      if (this.toplevels[i]?.[desktop]) {
        const shouldReturn = callback(i, desktop);
        if (shouldReturn) {
          return;
        }
      }
    }
  }

  forEachDesktop(screen: number, callback: (screen: number, desktop: number) => boolean | void): void {
    for (var i = 1; i <= workspace.desktops; i++) {
      if (this.toplevels[screen]?.[i]) {
        const shouldReturn = callback(screen, i);
        if (shouldReturn) {
          return;
        }
      }
    }
  }

  addAll(): void {
    this.toplevels = [];
    for (var i = 0; i < workspace.numScreens; i++) {
      if (!config.isIgnoredScreen(i)) {
        this.toplevels[i] = [];
        for (var j = 1; j <= workspace.desktops; j++) {
          if (!config.isIgnoredDesktop(j)) {
            this.toplevels[i][j] = new Toplevel(i, j);
          }
        }
      }
    }
  }

  addDesktop(desktop: number): void {
    if (!config.isIgnoredDesktop(desktop)) {
      for (var i = 0; i < workspace.numScreens; i++) {
        if (this.toplevels[i] && !this.toplevels[i][desktop]) {
          this.toplevels[i][desktop] = new Toplevel(i, desktop);
        }
      }
    }
  }

  removeDesktop(desktop: number): void {
    this.forEachScreen(desktop, (screen: number, desktop: number): void => {
      delete this.toplevels[screen][desktop];
    });
  }

  restoreLayout(screen: number, desktop: number) {
    if (this.toplevels[screen]?.[desktop]) {
      this.toplevels[screen][desktop].layout.restore();
    }
  }

  maxClients(screen: number, desktop: number): number {
    return this.toplevels[screen]?.[desktop] ? this.toplevels[screen][desktop].layout.maxClients : 0;
  }

  adjustMaxClients(screen: number, desktop: number, amount: number) {
    if (this.toplevels[screen]?.[desktop]) {
      this.toplevels[screen][desktop].layout.maxClients += amount;
    }
  }

  isFull(clients: Array<Client>, screen: number, desktop: number): boolean {
    return clients.length >= this.maxClients(screen, desktop);
  }

  isEmpty(clients: Array<Client>, screen: number, desktop: number): boolean {
    return this.toplevels[screen]?.[desktop] && clients.length === 0 ? true : false;
  }

  tileClients(clients: Array<Client>) {
    const screens = [];
    const desktops = [];

    clients.forEach((client: Client) => {
      if (screens.indexOf(client.screen) === -1) {
        screens.push(client.screen);
      }
      if (desktops.indexOf(client.desktop) === -1) {
        desktops.push(client.desktop);
      }
    });

    screens.forEach((screen: number) => {
      desktops.forEach((desktop: number) => {
        if (this.toplevels[screen]?.[desktop]) {
          this.toplevels[screen][desktop].tileClients(
            clients.filter((client: Client) => {
              return client.screen === screen && client.desktop === desktop;
            })
          );
        }
      });
    });
  }

  resizeClient(client: Client, previousGeometry: Geometry) {
    const { screen, desktop } = client;
    if (this.toplevels[screen]?.[desktop]) {
      this.toplevels[screen][desktop].layout.resizeClient(client, previousGeometry);
    }
  }
}

export default new ToplevelManager();
