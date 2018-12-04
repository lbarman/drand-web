import axios, { AxiosResponse } from 'axios';
import * as drand_go_api from '../drand-go-to-js/api';
import * as constants from './constants';
import { HttpRequestParameters, HttpService, IHttpResponse } from './HTTPService';

export interface IPublicKey {
    gid: number;
    point: string;
}

export interface IPublicKeyMessage {
    key: IPublicKey;
}

export interface IRandomness {
    gid: number;
    point: string;
}

export interface IRandomnessMessage {
    round: number;
    previous: string;
    randomness: IRandomness;
}

export interface IVerifiedRandomness {
    randomness: IRandomnessMessage;
    publicKey: IPublicKey;
    valid: boolean;
}

/**
 * A TS/JS Wrapper for Drand, the Distributed Randomness Beacon.
 * Exposes primarily fetchAndVerifyRandomness() which does exactly that.
 */
export class Drand {

    private serverPublicKey?: IPublicKey;

    constructor(
        private serverUrl: string) {

        this.serverUrl = this.serverUrl.trim();
        if (!this.serverUrl.endsWith('/')) {
            this.serverUrl += '/';
        }
    }

    /**
     * Fetches and return the public key of the server provided in the constructor
     */
    public async fetchAndVerifyRandomness(): Promise<IVerifiedRandomness> {
        const rnd = await this.fetchRandomness();
        const key = await this.getServerPublicKey();


        const valid = this.verifyRandomness(rnd, key);

        const answer: IVerifiedRandomness = {
            publicKey: key,
            randomness: rnd,
            valid: valid
        };

        return Promise.resolve(answer);
    }

    /**
     * Fetches and return the randomness from the server provided in the constructor
     */
    public async fetchRandomness(): Promise<IRandomnessMessage> {
        const url = this.serverUrl + constants.SERVER_RELATIVE_PATH_GET_RANDOMNESS;
        const answer = await this.buildRequest<IRandomnessMessage>(url);
        return answer.data;
    }

    /**
     * Fetches the public key of the server provided in the constructor, and stores it
     */
    public async fetchPublicKey(): Promise<IPublicKey> {
        const msg = await this.getPublicKey();
        return msg.key;
    }

    /**
     * Verifies a randomness message with a public key
     * @param randomnessMessage a Randomness message, e.g., the output of fetchRandomness()
     * @param publicKey a PublicKey message, e.g., the output of fetchPublicKey()
     */
    public verifyRandomness(randomnessMessage: IRandomnessMessage, publicKey: IPublicKey): boolean {


        // TODO: change type in drand-go-to-js
        return drand_go_api.Verify(randomnessMessage.previous, randomnessMessage.randomness.point, '' + randomnessMessage.round, publicKey.point)
    }

    /**
     * Returns the server URL provided in the constructor
     */
    public getServerUrl(): string {
        return this.serverUrl;
    }

    /**
     * (potentially fetches) and return the public key of the server provided in the constructor
     */
    public async getServerPublicKey(): Promise<IPublicKey> {
        if (this.serverPublicKey === undefined) {
            this.serverPublicKey = await this.fetchPublicKey();
        }
        return this.serverPublicKey;
    }

    /**
     * Fetches and return the public key of the server provided in the constructor
     */
    private async getPublicKey(): Promise<IPublicKeyMessage> {
        const url = this.serverUrl + constants.SERVER_RELATIVE_PATH_GET_PUBLIC_KEY;
        const answer = await this.buildRequest<IPublicKeyMessage>(url);
        return answer.data;
    }

    private buildRequest<T>(url: string): Promise<IHttpResponse<T>> {
        const request = HttpService.request<T>({
            method: 'get',
            url: url,
            timeout: 1000,
            responseType: 'json'
        });
        return request;
    }
}
