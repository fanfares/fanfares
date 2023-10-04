# NIP-108

This repo is the first implementation of NIP-108; Lightning Gated Notes. It is a way for anyone to create lightning-gated notes on Nostr.

If you want to play with it you can:

Check out the demo client at [nostrplayground.com](nostrplayground.com)

-- OR --

Build and host everything from scratch below:

# Setup

We used bun for this implementation. If you haven't you should install it.

To install:
```bash
bun install
```

Run the server:
```bash
bun server
```

Run the client:
```bash
bun client
```

Create a gated note:
```bash
bun createNote
```

# NIP
NIP-108
======

Lightning Gated Notes
-------------------------------

`draft` `optional` `author:coachchuckff` `author:excalibur_guild`

This NIP defines three events for gating Notes behind lightning paywalls: 

- Lightning-Gated Note ( `kind:55` ): This note allows you wrap any type of note behind a lightning gated paywall by encrypting the payload with a purchasable decrypt key.
- Key Note ( `kind:56` ): This note encrypts the key for a given note, per user, using `NIP-04` between the corresponding gate creator's public key and the purchasers. It is linked to the gated note with the `g` tag.
- Announcement Note ( `kind:54` ): This note acts as the announcement of the gated note, giving a short preview of the content. It is linked to the gated note with the `g` tag.

## Protocol flow
### Creating Gated Notes
1. Poster creates a note of any kind
2. Poster `JSON.stringify`'s the whole note.
3. Poster encrypts the note string with a `secret` (new nostr private key), and `iv` using `aes-256-cbc`.
4. Poster creates the gated note `kind:55` with the encrypted note json string for the content while putting `iv`, `cost` (mSats), and `endpoint` as tags. The `endpoint` tag is the server endpoint you use to hold your `secret`s and issue lightning invoices from your `lud16`.
5. Poster then creates an announcement note `kind:54` with the `g` tag (gated note's id) to preview the gated content.

### Consuming Gated Notes
1. Client finds gated content they want to purchase by browsing `kind:54` announcement notes. 
2. Client loads the associated gated note of `kind:55` found in the `g` tag
3. Client then GETs the `endpoint` tag
4. Gate server will respond with a 402 PR requesting a payment for the `cost` tag's amount in mSats
5. Client pays the amount
6. Client uses the `successAction` url returned in the PR to fetch the `secret` which will unlock the gated content.
7. Client uses the `secret` and the gated note's `iv` tag to decrypt the content using `aes-256-cbc`
8. Client then creates a key note `kind:56` with the content being the `nip-04` encrypted secret with their publicKey and the gate note's creator publicKey.
9. Upon revisiting the gated note, the client can then decrypt the content using their key note.  

## Server Functions
NIP-108 requires an outside server to store `secret`s and issue lighting invoices to those wishing to purchase the digital content.
### Create a Gated Note

```typescript
APP.post("/create")
```

```typescript
export interface CreateNotePostBody {
  gateEvent: VerifiedEvent<number>;
  lud16: string;
  secret: string;
  cost: number;
}
```

### Handling Purchases

```typescript
APP.post("/:noteId")
```


### Get Results

```typescript
APP.post("/:noteId/:paymentHash")
```

## Encryption/Decryption
### Gated Note Content

```typescript
import * as cryptoBrowser from 'crypto-browserify';

const algorithm: string = 'aes-256-cbc';

export interface EncryptedOutput {
    iv: string;
    content: string;
}

export function encrypt(text: string, key: Buffer): EncryptedOutput {
    const iv: Buffer = cryptoBrowser.randomBytes(16);
    const cipher = cryptoBrowser.createCipheriv(algorithm, key, iv);
    const encrypted: Buffer = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

export function decrypt(iv: string, content: string, key: Buffer): string {
    const decipher = cryptoBrowser.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    const decrypted: Buffer = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

    return decrypted.toString('utf8');
}
```

## Event Reference and Examples

Uses `nip-04`

### GatedNote

`kind:55`

`.content` should be a JSON stringified version of the following JSON:
```typescript
  enum OfferingStatus {
    up = 'UP',
    down = 'DOWN',
    closed = 'CLOSED'
  }

  interface OfferingContent = {
    endpoint: string,          // The POST endpoint you call to pay/fetch
    status: OfferingStatus,    // UP/DOWN/CLOSED
    cost: number,              // The cost per call in mSats
    schema?: Object,           // Recommended - JSON schema for the POST body of the endpoint
    outputSchema?: Object,     // Recommended - JSON schema for the response of the call
    description?: string       // Optional - Description for the end user
  }
```

`.tag` MUST include the following:

- `s`, the service tag should simply be the underlying API endpoint of the service provided. For example if you are offering a ChatGPT service, you would set `s` = `https://api.openai.com/v1/chat/completions`. This way the service they are buying is implicit.
- `d`, following **parameterized replaceable events** in [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md), this tag allows this event to be replaceable. Since there should only be one service per pubkey, the `d` tag should match the `s` tag.

### Example Service Event

```typescript

const content = {
  endpoint: "https://example.api/chat/",
  status: "UP",
  cost: 5000,
  schema: {...},
  outputSchema: {...},
  description: "This will call the ChatGPT endpoint"
}

const event = {
  "kind": 31402,
  "created_at": 1675642635,
  "content": JSON.stringify(content),
  "tags": [
    ["s", "https://api.openai.com/v1/chat/completions"]
    ["d", "https://api.openai.com/v1/chat/completions"],
  ],
  "pubkey": "<pubkey>",
  "id": "<id>"
}
```

### Example Schema

The following is for the `gpt-3.5-turbo` input schema:

```json
{
    "type": "object",
    "properties": {
        "model": {
            "type": "string",
            "enum": ["gpt-3.5-turbo"]
        },
        "messages": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "role": {
                        "type": "string",
                        "enum": ["system", "user"]
                    },
                    "content": {
                        "type": "string"
                    }
                },
                "required": ["role", "content"]
            },
            "minItems": 1
        }
    },
    "required": ["model", "messages"]
}
```

The following is for the `gpt-3.5-turbo` output schema:

```json
{
    "type": "object",
    "required": ["id", "object", "created", "model", "choices", "usage"],
    "properties": {
      "id": {
        "type": "string",
        "pattern": "^chatcmpl-[a-zA-Z0-9-]+$"
      },
      "object": {
        "type": "string",
        "enum": ["chat.completion"]
      },
      "created": {
        "type": "integer"
      },
      "model": {
        "type": "string"
      },
      "choices": {
        "type": "array",
        "items": {
          "type": "object",
          "required": ["index", "message"],
          "properties": {
            "index": {
              "type": "integer"
            },
            "message": {
              "type": "object",
              "required": ["role", "content"],
              "properties": {
                "role": {
                  "type": "string",
                  "enum": ["assistant"]
                },
                "content": {
                  "type": "string"
                }
              }
            },
            "finish_reason": {
              "type": "string",
              "enum": ["stop"]
            }
          }
        }
      },
      "usage": {
        "type": "object",
        "required": ["prompt_tokens", "completion_tokens", "total_tokens"],
        "properties": {
          "prompt_tokens": {
            "type": "integer"
          },
          "completion_tokens": {
            "type": "integer"
          },
          "total_tokens": {
            "type": "integer"
          }
        }
      }
    }
  }
```
### Safety

It is not mandatory, but to raise the barrier to entry, clients should screen service provider's NIP-05 identifier. The domain used in their NIP-05, should be the same domain used for their endpoint.

Clients may wish to create a whitelist of trusted service providers once tested.

### Problems

- No data integrity - service providers can store/redistribute any data passed to them
- Service providers could take payment and never return the product
- Service providers are not guaranteed to call the endpoint specified in the `s` tag
- No recourse for errored API fetches
- The `cost` field may not match the actual final price
- No proof of purchase

### Example Implementations

- [Server](https://github.com/Team-Pleb-TabConf-2023/nip-105-server)
- [Client](https://github.com/Team-Pleb-TabConf-2023/nip-105-client)
