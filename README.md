# Drand-web [![Build Status](https://travis-ci.com/lbarman/drand-web.svg?branch=master)](https://travis-ci.com/lbarman/drand-web)

A TS/JS wrapper and a web interface for the drand project.

## DrandJS

The main component is a Typescript library that provides the following methods:

``` typescript
class Drand {
    constructor(private serverUrl: string): void

    // Fetches and return the public key of the server provided in the constructor
    public async fetchAndVerifyRandomness(): Promise<IVerifiedRandomness>

    //Fetches and return the randomness from the server provided in the constructor
    public async fetchRandomness(): Promise<IRandomnessMessage>

    // Fetches the public key of the server provided in the constructor, and stores it
    public async fetchPublicKey(): Promise<IPublicKey>

    // Verifies a randomness message with a public key
    public verifyRandomness(msg: IRandomnessMessage, publicKey: IPublicKey): boolean

    //Returns the server URL provided in the constructor
    public getServerUrl(): string

    // (potentially fetches) and returs the public key of the server provided in the constructor
    public async getServerPublicKey(): Promise<IPublicKey>
}
```

Typically, the library is used like this:

``` typescript
const d = new Drand('https://WEBSITE'); // will try to get https://WEBSITE/public for the randomness
d.fetchAndVerifyRandomness().then((data) => console.log(data));

// data is a IVerifiedRandomness struct as follows
interface IVerifiedRandomness {
    randomness: IRandomnessMessage;
    publicKey: IPublicKey;
    valid: boolean;
}

// ... and could be
{
  publicKey: {
    gid: 22,
    point: "017f225..."
  },
  randomness: {
    round: 2,
    previous: "2dbb77ae...",
    randomness: {
      gid: 21,
      point: "6a3557e04..."
    }
  },
  valid: true
}
```

Internally, `drand.ts` calls a JS lib created from `Go` with `GopherJS`, and manually typed (`drandjs/drand-go-to-js/api.d.ts`).
Ideally, at some point this should be replaced with a pure typescript code for verifying the signature.

## Web

This is a minimal web UI that uses DrandJS to contact a server and periodically show the output.

## How to run

Simply open `web/index.html`, as a recent `drand.js` is already built in `web`.

## How to build

Prerequisites: gopherjs, yarn

The top-level Makefile exposes `all` and `test`, they do all the things.

Internally, `all` runs the commands `test` and `build` in the `drandjs` folder. 
The details follow. In the `drandjs`, this:
1. installs the npm packages
2. calls gopherjs to create `drand-go-to-js/api.js`
3. tests the go and the TS code with `go test` and `jest`
4. compiles and packs the main typescript file `src/drand.ts`
5. outputs a JS binary in `dist/drand.js`
6. in the root folder, copies `drandjs/dist/drand.js` into `web`
