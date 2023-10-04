import bolt11 from "bolt11";

// ---------------------- INTERFACES ---------------------------

interface Verify {
    status: "OK" | "ERROR";
    settled: boolean;
    preimage: string | null;
    pr: string;
}

export interface Invoice {
  status: "OK" | "ERROR"; 
  successAction: SuccessAction;
  verify: string;
  routes: string[]; 
  pr: string;
  paymentHash: string;
}

export interface SuccessAction {
  tag: "url"; // Similarly, if there are other possible tags, you can expand this with a union type like "url" | "otherTag" etc.
  url: string;
  description: string;
}

export interface Lud6 {
  status: string;
  tag: string;
  commentAllowed: number;
  callback: string;
  metadata: string;
  minSendable: number;
  maxSendable: number;
  payerData: PayerData;
  nostrPubkey: string;
  allowsNostr: boolean;
}

export interface PayerData {
  name: PayerDataDetail;
  email: PayerDataDetail;
  pubkey: PayerDataDetail;
}

export interface PayerDataDetail {
  mandatory: boolean;
}

// ---------------------- HELPERS ---------------------------

export function isValidLud16(lud16: string){
  // Regular expression to validate common email structures
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(lud16);
}

export function getLud16Url(lud16: string) {
  const parts = lud16.split("@");
  if (parts.length !== 2) {
    throw new Error(`Invalid lud16: ${lud16}`);
  }
  const username = parts[0];
  const domain = parts[1];
  return `https://${domain}/.well-known/lnurlp/${username}`;
}

async function getPaymentHash(pr: string): Promise<string> {
  const decodedPR = await bolt11.decode(pr);

  if (!decodedPR) throw new Error("Could not bolt11 parse PR");

  const paymentHashTag = decodedPR.tags.find(
    (tag) => tag.tagName === "payment_hash"
  );

  if (!paymentHashTag || !paymentHashTag.data) {
    throw new Error("Payment hash tag not found or invalid");
  }

  return paymentHashTag.data as string;
}

function getSuccessAction(serverUrl: string, noteId: string, paymentHash: string) {
  return {
    tag: "url",
    url: `${serverUrl}/${noteId}/${paymentHash}`,
    description: "Open to get your secret key for the note",
  };
}

// ---------------------- FUNCTIONS ---------------------------

export async function getInvoice(
  lud16: string,
  serverUrl: string,
  msats: number,
  noteId: string,
  expiration?: Date
): Promise<Invoice> {
  const lud6Url = getLud16Url(lud16);

  try {
    const lud16Response = await fetch(lud6Url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!lud16Response.ok) {
      const errorData = await lud16Response.json();
      throw new Error(`lnurl error: ${errorData.message || "Unknown error"}`);
    }

    const lud6 = (await lud16Response.json()) as Lud6;

    if (msats > lud6.maxSendable || msats < lud6.minSendable) {
      throw new Error(
        `${msats} msats not in sendable range of ${lud6.minSendable} - ${lud6.maxSendable}`
      );
    }

    const expirationTime = expiration
      ? expiration.getTime() / 1000
      : (Date.now() + 3600 * 1000) / 1000;
    const invoiceUrl = `${lud6.callback}?amount=${msats}&expiry=${Math.floor(
      expirationTime
    )}`;

    const invoiceResponse = await fetch(invoiceUrl);
    const invoiceResponseData = await invoiceResponse.json();

    const paymentHash = await getPaymentHash(invoiceResponseData.pr);

    const invoice = {
      ...invoiceResponseData,
      paymentHash,
      successAction: getSuccessAction(serverUrl, noteId, paymentHash),
    };

    return invoice;
  } catch (error) {
    throw error; // This will pass through any error from the API or network
  }
}

export async function checkPaid(verify: string): Promise<Verify>{
    const verifyRequest = await fetch(verify);
    return await verifyRequest.json();
}
