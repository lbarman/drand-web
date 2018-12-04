import { readFileSync } from 'fs';
import * as constants from '../src/constants';
import { Drand, IPublicKeyMessage } from '../src/drand';
import { HttpService, IHttpResponse } from '../src/HTTPService';

function response<T>(data: T): IHttpResponse<T> {
    return {
        data: data
    };
}

let mockAPI: jest.Mock;
const WEBSERVER = 'http://WEB_SERVER';
const RANDOMNESS_URL = WEBSERVER + '/' + constants.SERVER_RELATIVE_PATH_GET_RANDOMNESS;
const PUBLICKEY_URL = WEBSERVER + '/' + constants.SERVER_RELATIVE_PATH_GET_PUBLIC_KEY;

// run relative to root, hence /test/
const PUBLICKEY_FILE = './test/data/publickey.txt';
const RANDOMNESS_FILE = './test/data/randomness.txt';

describe('Drand can', () => {

    beforeEach(() => {
        mockAPI = jest.fn();
        HttpService.mock(mockAPI);
    });

    it('contacts the webserver for key', () => {
        const d = new Drand(WEBSERVER);
        expect(d.getServerUrl()).toEqual(WEBSERVER + '/'); // Should add / to servers

        // serve this file as the answer
        const publicKeyJson = JSON.parse(readFileSync(PUBLICKEY_FILE, 'utf8'));
        mockAPI.mockImplementationOnce((_parameters) => {
            console.log("API called")
            return Promise.resolve(response<IPublicKeyMessage>(publicKeyJson));
        });

        d.fetchPublicKey();

        expect(mockAPI).toHaveBeenCalledTimes(1);
        expect(mockAPI).toHaveBeenCalledWith({
            url: PUBLICKEY_URL,
            method: 'get',
            timeout: 1000,
            responseType: 'json'
        });

        expect(d.getServerPublicKey()).toEqual('test')
    });

    it('contacts the webserver for randomness', () => {
        const d = new Drand(WEBSERVER);
        expect(d.getServerUrl()).toEqual(WEBSERVER + '/'); // Should add / to servers

        d.fetchRandomness();

        expect(mockAPI).toHaveBeenCalledTimes(1);
        expect(mockAPI).toHaveBeenCalledWith({
            url: RANDOMNESS_URL,
            method: 'get',
            timeout: 1000,
            responseType: 'json'
        });
    });
})
