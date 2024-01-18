export enum PrimalScope {
  global = "global",
  network = "network",
  tribe = "tribe",
  follows = "follows",
}

// AKA 'timeframe'
export enum PrimalSort {
  trending = "trending",
  mostzapped = "mostzapped",
  mostzapped4h = "mostzapped4h",
  popular = "popular",
  latest = "latest",
}

export type NostrPostStats = {
  event_id: string;
  likes: number;
  mentions: number;
  reposts: number;
  replies: number;
  zaps: number;
  satszapped: number;
  score: number;
  score24h: number;
};

export type ExploreFeedPayload = {
  timeframe: string;
  scope: string;
  limit: number;
  user_pubkey?: string;
  since?: number;
  until?: number;
  created_after?: number;
};

export type MediaSize = "o" | "s" | "m" | "l";

export type MediaVariant = {
  s: MediaSize;
  a: 0 | 1;
  w: number;
  h: number;
  mt: string;
  media_url: string;
};

export type MediaEvent = {
  event_id: string;
  resources: { url: string; variants: MediaVariant[] }[];
};

export const second = 1000;
export const minute = 60 * second;
export const hour = 60 * minute;
export const day = 24 * hour;
export const week = 7 * day;

export function getExploreFeed(
  pubkey: string | undefined,
  subid: string,
  scope: string,
  timeframe: string,
  until = 0,
  limit = 20,
  primalSend: (data: string) => void
) {
  let payload: ExploreFeedPayload = { timeframe, scope, limit };

  if (pubkey) {
    payload.user_pubkey = pubkey;
  }

  if (until > 0) {
    payload.until = until;
  }

  if (timeframe === "trending") {
    const yesterday = Math.floor((new Date().getTime() - day) / 1000);

    payload.created_after = yesterday;
  }

  if (timeframe === "mostzapped4h") {
    const fourHAgo = Math.floor((new Date().getTime() - 4 * hour) / 1000);

    payload.timeframe = "mostzapped";
    payload.created_after = fourHAgo;
  }

  // primalSend(JSON.stringify([
  //     "REQ",
  //     subid,
  //     {cache: [
  //       "explore_global_mostzapped_4h",
  //       { user_pubkey: pubkey },
  //     ]},
  //   ]));

  primalSend(JSON.stringify(["REQ", subid, { cache: ["explore", payload] }]));
}
