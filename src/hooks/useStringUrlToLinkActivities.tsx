/* eslint-disable @typescript-eslint/no-magic-numbers */
import { SupName } from "@emrm-types/sup";
import { useSupParam } from "@prom/data-layer/sup";
import { changeStringByRegexpMatches } from "@sber-emrm/focus-shared";
import { LinkUI } from "@sber-emrm/focus-ui";
import { useCallback } from "react";

const isAllowedDomain = (url: string, allowedDomains: string[]): boolean => {
  if (!allowedDomains) {
    return true;
  }

  try {
    const domain = new URL(url).hostname.split(".").slice(-2).join(".");

    const isDomainAllowed = allowedDomains.some(
      (allowedDomain) => domain === allowedDomain
    );

    return isDomainAllowed;
  } catch (err) {
    return false;
  }
};

export const urlRegEx =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gim;
export const urlMarkdownRegEx =
  /\[([^[\]]+)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*))\)/gim;

export const useStringUrlToLinkActivities = (): ((
  str: string
) => Array<string | JSX.Element>) => {
  const allowedDomains = useSupParam(
    SupName.focusActivitiesAllowedDomainAddresses
  ).value;

  const getLinks = useCallback(
    (text: string) => {
      const markDownLinks = changeStringByRegexpMatches(
        text,
        urlMarkdownRegEx,
        (match) => {
          const [markdownStr, desc, link] = match;

          if (isAllowedDomain(link, allowedDomains)) {
            return (
              <LinkUI key={match.index} href={link}>
                {desc}
              </LinkUI>
            );
          }

          return markdownStr;
        }
      );

      const links = markDownLinks.map((el, i) => {
        if (typeof el === "string") {
          return changeStringByRegexpMatches(el, urlRegEx, (match) => {
            const [link] = match;

            if (isAllowedDomain(link, allowedDomains)) {
              return (
                <LinkUI key={`${i}_${match.index}`} href={link}>
                  {link}
                </LinkUI>
              );
            }

            return link;
          });
        }

        return el;
      });

      return links.flat();
    },
    [allowedDomains]
  );

  return getLinks;
};
