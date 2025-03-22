import styled, { css } from "styled-components";

import { ANIMATION_TIME_CLOSE, ANIMATION_TIME_OPEN } from "./constants";

const Container = styled.div<{ isOpen: boolean }>`
  overflow: auto;
  ${({ isOpen }) => {
    if (isOpen) {
      return css`
        transition: max-height ${ANIMATION_TIME_OPEN}ms ease-out;
      `;
    }

    return css`
      transition: max-height ${ANIMATION_TIME_CLOSE}ms linear;
    `;
  }};

  width: 100%;
`;

export const Styled = { Container };
