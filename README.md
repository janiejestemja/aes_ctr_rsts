## aes_ctr_rsts
---
> AES CTR 256 bits encryption written in Rust & compiled to WebAssembly. 

## Usage...
---
Download and untar the latest github release...
```bash
mkdir pkg
tar -xzf aes_ctr_rsts.tar.gz -C pkg
```
Setup a `tsconfig.json` like...
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "es2022",
    "moduleResolution": "bundler",
    "lib": ["DOM", "es2022", "es2015", "esnext"],
    "strict": true
  },
  "include": ["main.ts", "./pkg/aes_ctr_rsts.js"]
}
```

Write your `main.ts` and use the module like...
```ts
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
  console.log("something");
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
```

Compile it via `tsc` using...
```bash
tsc
```

Use the compiled `main.js` in your `index.html` like...
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Demo</title>
</head>
<body>
  <button id="demo-btn">Cipherleaf</button>
</body>
  <script type="module" src="./main.js"></script>
</html>
```

Try it out like...
```bash
python -m http.server -- 8000
```

and visit `localhost:8000/index.html`.

## Developer notes...
---
> Building from source

### Prerequisites
---
- Rust + wasm-pack

### Install dependencies
---
- Installing wasm-pack
```bash
cargo install wasm-pack
```

### Compile Rust to WebAssembly
---
```bash
wasm-pack build --target web
```
