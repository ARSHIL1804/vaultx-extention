
// const enc = new TextEncoder();
// const dec = new TextDecoder();

import { pbkdf2Sync } from "crypto";

export function encodeBase64(uint8Array) {
    return btoa(String.fromCharCode(...uint8Array));
}

export function decodeBase64(base64String) {
    return new Uint8Array([...atob(base64String)].map(char => char.charCodeAt(0)));
}

export async function deriveKey(password: string, salt) {
    // Convert password string to buffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import password as raw key
    const baseKey = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits']
    );

    // Derive key using PBKDF2
    const params = {
        name: 'PBKDF2',
        hash: 'SHA-512',
        salt: salt,
        iterations: 100000
    };

    const derivedBits = await crypto.subtle.deriveBits(
        params,
        baseKey,
        256 // 32 bytes = 256 bits
    );

    return new Uint8Array(derivedBits);
}