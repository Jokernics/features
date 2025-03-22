import { ElementBaseCssProps } from "@sber-emrm/focus-ui";
import React, { FC } from "react";

import { lazyImport } from "./lazyImport";

export type LottieProps = ElementBaseCssProps & {
  loop?: boolean;
  autoplay?: boolean;
  keepLastFrame?: boolean;
};

export function decorateLottiePlayer<T extends object>(
  getJson: () => Promise<T>,
  props?: LottieProps
): FC<LottieProps> {
  return lazyImport(() =>
    Promise.all([
      import(/* webpackPreload: true */ "@lottiefiles/react-lottie-player"),
      getJson(),
    ]).then(([{ Player }, data]) => ({
      default: (additionalProps: LottieProps) => (
        <Player {...props} {...additionalProps} src={data} />
      ),
    }))
  );
}
