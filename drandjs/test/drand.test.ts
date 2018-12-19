import { readFileSync } from 'fs';
import * as constants from '../src/constants';
import { Drand, IPublicKeyMessage } from '../src/drand';
import { HttpService, IHttpResponse } from '../src/HTTPService';


// constants
const WEBSERVER = 'http://WEB_SERVER';
const RANDOMNESS_URL = WEBSERVER + '/' + constants.SERVER_RELATIVE_PATH_GET_RANDOMNESS;
const PUBLICKEY_URL = WEBSERVER + '/' + constants.SERVER_RELATIVE_PATH_GET_PUBLIC_KEY;

// run relative to root, hence /test/
const PUBLICKEY_FILE = './test/data/publickey.txt';
const RANDOMNESS_FILE = './test/data/randomness.txt';

// This mockAPI replaces Axios
let mockAPI: jest.Mock;
function response<T>(data: T): IHttpResponse<T> {
    return {
        data
    };
}

describe('Drand can', () => {

    beforeEach(() => {
        mockAPI = jest.fn();
        HttpService.mock(mockAPI);
    });

    it.only('manually validates randomness', () => {
        const d = new Drand('dummy');

        // Mock API serves those files as the answer
        const randomnessJson = JSON.parse(readFileSync(RANDOMNESS_FILE, 'utf8'));
        const publicKeyJson = JSON.parse(readFileSync(PUBLICKEY_FILE, 'utf8'));

        const res = d.verifyRandomness(randomnessJson, publicKeyJson.key);

        expect(res).toBe(true);
    })

    it('contacts the webserver for key', async () => {
        const d = new Drand(WEBSERVER);
        expect(d.getServerUrl()).toEqual(WEBSERVER + '/'); // Should add / to servers

        // Mock API serves this file as the answer
        const publicKeyJson = JSON.parse(readFileSync(PUBLICKEY_FILE, 'utf8'));
        mockAPI.mockImplementation((_parameters) => {
            return Promise.resolve(response<IPublicKeyMessage>(publicKeyJson));
        });

        // fetch and return
        let key = await d.fetchPublicKey();
        expect(key).toEqual(publicKeyJson.key);

        expect(mockAPI).toHaveBeenCalledTimes(1);
        expect(mockAPI).toHaveBeenCalledWith({
            url: PUBLICKEY_URL,
            method: 'get',
            timeout: 1000,
            responseType: 'json'
        });

        // fetch and store
        key = await d.getServerPublicKey();
        expect(key).toEqual(publicKeyJson.key);

        expect(mockAPI).toHaveBeenCalledTimes(2);

        // now the key should be buffered
        key = await d.getServerPublicKey();
        expect(key).toEqual(publicKeyJson.key);

        expect(mockAPI).toHaveBeenCalledTimes(2);
    });

    it('contacts the webserver for randomness', async () => {
        const d = new Drand(WEBSERVER);
        expect(d.getServerUrl()).toEqual(WEBSERVER + '/'); // Should add / to servers

        // Mock API serves this file as the answer
        const randomnessJson = JSON.parse(readFileSync(RANDOMNESS_FILE, 'utf8'));
        mockAPI.mockImplementation((_parameters) => {
            return Promise.resolve(response<IPublicKeyMessage>(randomnessJson));
        });

        const rnd = await d.fetchRandomness();
        expect(rnd).toEqual(randomnessJson);

        expect(mockAPI).toHaveBeenCalledTimes(1);
        expect(mockAPI).toHaveBeenCalledWith({
            url: RANDOMNESS_URL,
            method: 'get',
            timeout: 1000,
            responseType: 'json'
        });
    });

    it('contacts the webserver for public + randomness, and verifies it', async () => {
        const d = new Drand(WEBSERVER);
        expect(d.getServerUrl()).toEqual(WEBSERVER + '/'); // Should add / to servers

        // Mock API serves those files as the answer
        const randomnessJson = JSON.parse(readFileSync(RANDOMNESS_FILE, 'utf8'));
        const publicKeyJson = JSON.parse(readFileSync(PUBLICKEY_FILE, 'utf8'));
        mockAPI.mockImplementation((_parameters) => {
            if (_parameters.url === RANDOMNESS_URL) {
                return Promise.resolve(response<IPublicKeyMessage>(randomnessJson));
            } else if (_parameters.url === PUBLICKEY_URL) {
                return Promise.resolve(response<IPublicKeyMessage>(publicKeyJson));
            }
        });

        const result = await d.fetchAndVerifyRandomness();
        expect(result.randomness).toEqual(randomnessJson);
        expect(result.publicKey).toEqual(publicKeyJson.key);
        expect(result.valid).toEqual(true);

        expect(mockAPI).toHaveBeenCalledTimes(2);
    });
})
