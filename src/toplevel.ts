import { Client } from "./client";
import { config } from "./config";
import { Geometry, geometryUtils } from "./geometry";
import { Layout } from "./layout";
import { layouts } from "./layouts/layouts";
import { workspace } from "./workspace";

const SelectedLayout = layouts[config.layout];

export default class Toplevel {
  screen: number;
  desktop: number;

  geometry: Geometry;
  layout: Layout;

  constructor(screen: number, desktop: number) {
    this.screen = screen;
    this.desktop = desktop;

    this.geometry = geometryUtils.withMargins(workspace.clientArea(2, screen, desktop));

    this.layout = SelectedLayout(this.geometry);
    if (config.maxClients > -1) {
      this.layout.maxClients = Math.min(this.layout.maxClients, config.maxClients);
    }
  }

  hasGeometryChanged(newGeometry: Geometry) {
    return (
      this.geometry.x !== newGeometry.x ||
      this.geometry.y !== newGeometry.y ||
      this.geometry.width !== newGeometry.width ||
      this.geometry.height !== newGeometry.height
    );
  }

  onGeometryChanged(newGeometry: Geometry) {
    this.geometry = newGeometry;
    this.layout.adjustGeometry(newGeometry);
  }

  tileClients(clients: Array<Client>): void {
    const currentGeometry = geometryUtils.withMargins(workspace.clientArea(2, this.screen, this.desktop));

    if (this.hasGeometryChanged(currentGeometry)) {
      this.onGeometryChanged(currentGeometry);
    }

    this.layout.tileClients(clients);
  }
}
