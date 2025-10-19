import init, {AesCtrSecret} from "./pkg/aes_ctr_rsts.js"
const demoBtn = document.getElementById("demo-btn") as HTMLButtonElement;

/* Initialise rust wasm */
await init();

let plaintext: string = "Secret placeholder";
const encoded = new TextEncoder().encode(plaintext);
let {key, nonce} = await deriveKeyAndNonce("abc");
const encrypted = new AesCtrSecret(key, nonce).encrypt(encoded);
const decrypted = new AesCtrSecret(key, nonce).encrypt(encrypted);
const decoded = new TextDecoder().decode(decrypted);

demoBtn?.addEventListener("click", async () => {
  console.log(decoded);
});

async function deriveKeyAndNonce(passphrase: string): Promise<{ key: Uint8Array, nonce: Uint8Array }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(passphrase);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = new Uint8Array(hashBuffer);

    const key = hashArray.slice(0, 32);
    const nonce = hashArray.slice(0, 8).reverse();

    return { key, nonce };
}
