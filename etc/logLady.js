// @flow

import fetch from "isomorphic-unfetch";
import cookies from "js-cookie";

import { loadFromSession } from "./marketingHelpers";

type Payload = {
  events: {
    category: string,
    subCategory?: string,
    action: string,
    detail?: string,
    timestamp: number,
    props: { [id: string]: any },
    destinations: {
      exponea?: boolean,
      ga?: boolean,
      logmole?: boolean,
      [others: string]: any,
    },
    [others: string]: any,
  }[],
  global: {
    userId: string,
    module?: string,
    pageName?: string,
    sessionId?: string,
    deeplinkId: string,
    pageViewId?: string,
    affilId: string,
    brandingId: string,
    url: string,
    UTMs: { [id: string]: string },
  },
};

export const LOG_LADY_URL = process.env.LOG_LADY_URL || "";

export function preparePayload(action: string, detail?: string): Payload {
  const pathParts = window.location.pathname.split("/").filter(val => val);
  return {
    events: [
      {
        category: "Stopovers",
        action,
        detail: detail || "",
        props: { city: pathParts[2] },
        destinations: {
          exponea: true,
        },
        timestamp: new Date().getTime(),
      },
    ],
    global: {
      userId: cookies.get("SKYPICKER_VISITOR_UNIQID"),
      affilId: cookies.get("SKYPICKER_AFFILIATE") || "",
      deeplinkId: "",
      langId: pathParts[0],
      url: window.location.href,
      referrer: window.document.referrer,
      brandingId: "kiwicom",
      UTMs: loadFromSession(),
    },
  };
}

export function sendEvent(action: string, detail?: string) {
  const payload = preparePayload(action, detail);
  try {
    fetch(LOG_LADY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
}
