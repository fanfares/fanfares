import * as cryptoBrowser from 'crypto-browserify';

const algorithm: string = 'aes-256-cbc';

export interface EncryptedOutput {
    iv: string;
    content: string;
}

export function hashToKey(inputString: string): Buffer {
    return cryptoBrowser.createHash('sha256').update(inputString).digest();
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
