import { SHA256 } from "crypto-js";
import { VerifiedEvent } from "nostr-tools";
import { decode } from 'bolt11';

export function getSince({ days = 0, hours = 0, minutes = 0, seconds = 0 }) {
    return Math.round((Date.now() / 1000) - (60 * 60 * 24 * days) - (60 * 60 * hours) - (60 * minutes) - seconds);
}

export function getTag(event: VerifiedEvent, tag: string) {
    const tagIndex = event.tags.findIndex(t => t[0] === tag);
    return tagIndex > -1 ? event.tags[tagIndex][1]:null;
}

export function verifyZap(event: VerifiedEvent) {
    try {

        if(event.kind !== 9735) throw new Error(`wrong kind: ${event.kind}`);
        if(event.content) throw new Error('has content');

        const p = getTag(event, 'p');
        const bolt11 = getTag(event, 'bolt11');
        const description = getTag(event, 'description');
        const preimage = getTag(event, 'preimage');

        if (!p) throw new Error('No p tag');
        if (!bolt11) throw new Error('No bolt11 tag');
        if (!description) throw new Error('No description tag');
        // if (!preimage) throw new Error('No preimage tag');

        const bolt11Invoice = decode(bolt11);
        const commitHash = bolt11Invoice.tagsObject.purpose_commit_hash;
        const paymentHash = bolt11Invoice.tagsObject.payment_hash;
        const descriptionHash = SHA256(description).toString();
        const invoiceAmount = bolt11Invoice.millisatoshis;

        if(!paymentHash) throw new Error('bolt11 does not have payment_hash');
        if(!commitHash) throw new Error('bolt11 does not have purpose_commit_hash');
        if(!invoiceAmount) throw new Error('bolt11 does not have satoshis');
        if(commitHash !== descriptionHash) throw new Error('bolt11 does not match description');

        const zapRequest = JSON.parse(description) as VerifiedEvent;
        if (!zapRequest) throw new Error('No zap request');

        const zapRequestP = getTag(zapRequest, 'p');
        const amount = getTag(zapRequest, 'amount');
        const lnurl = getTag(zapRequest, 'lnurl');

        if (!zapRequestP) throw new Error('No zap request p tag');
        if (!amount) throw new Error('No amount tag');
        if (!lnurl) throw new Error('No lnurl tag');

        //TODO LNURL verification

        if(zapRequestP !== p) throw new Error('p tag does not match zap request p tag');
        if(amount !== invoiceAmount) throw new Error('amount tag does not match invoice amount');

        const amountNum = Number(amount);
        if (!amount || isNaN(amountNum)) throw new Error('Amount is not a number');

        return amountNum;
    } catch (e) {
        // console.log(`${event.id.substring(0, 5)}: Ill formatted zap: ${e}`);
        return null;
    }
}