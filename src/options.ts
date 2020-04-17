interface Options {
  windowSnapZone: number;
  electricBorderMaximize: boolean;
  electricBorderTiling: boolean;
}

// @ts-ignore, KWin global
export const options: Options = options || {};
