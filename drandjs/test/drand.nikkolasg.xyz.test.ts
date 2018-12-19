import Axios from 'axios';
import * as constants from '../src/constants';
import { fail } from 'assert';
import { Drand, IPublicKeyMessage, IPublicKey } from '../src/drand';


// constants
const WEBSERVER = 'https://drand.nikkolasg.xyz:8888';
const RANDOMNESS_URL = WEBSERVER + '/' + constants.SERVER_RELATIVE_PATH_GET_RANDOMNESS;
const PUBLICKEY_URL = WEBSERVER + '/' + constants.SERVER_RELATIVE_PATH_GET_PUBLIC_KEY;


describe('Drand can', () => {

    it.skip('contacts the webserver ' + WEBSERVER + ' for key + randomness', async () => {

        // first manually contact the server
        let response = await Axios.get(RANDOMNESS_URL, {method: 'get', timeout: 1000});
        if (response.status !== 200) {
            console.log();
            fail('This test is only meant to be executed with ' + WEBSERVER + ' up, but it cannot be reached. Aborting.');
        }
        response = await Axios.get(PUBLICKEY_URL, {method: 'get', timeout: 1000});
        if (response.status !== 200) {
            console.log();
            fail('This test is only meant to be executed with ' + WEBSERVER + ' up, but it cannot be reached. Aborting.');
        }

        // now try getting some randomness
        const d = new Drand(WEBSERVER);

        // fetch and return
        const key = await d.fetchPublicKey();
        const rnd = await d.fetchRandomness();
        const valid = d.verifyRandomness(rnd, key);

        const valid2 = await d.fetchAndVerifyRandomness();

        expect(valid).toBe(true);
        expect(valid2).toBe(true);
    });

    it.skip('contacts the webserver ' + WEBSERVER + ' for randomness only', async () => {

        // first manually contact the server
        let response = await Axios.get(RANDOMNESS_URL, {method: 'get', timeout: 1000});
        if (response.status !== 200) {
            console.log();
            fail('This test is only meant to be executed with ' + WEBSERVER + ' up, but it cannot be reached. Aborting.');
        }
        response = await Axios.get(PUBLICKEY_URL, {method: 'get', timeout: 1000});
        if (response.status !== 200) {
            console.log();
            fail('This test is only meant to be executed with ' + WEBSERVER + ' up, but it cannot be reached. Aborting.');
        }

        // now try getting some randomness
        const d = new Drand(WEBSERVER);

        // fetch and return
        const key = await d.fetchPublicKey();

        const key2: IPublicKey = {
            gid: 22,
            point: '011d0a21c0d192877cf1994da7e5d2712a87bc92fffad17af2ce02b22f02ba08e84f84fd9ccdb14e6f92cce5a66a1047b6d66867b79cafb32949f6b1e8b40e61d832bbdec7faf1be920b842003e6dbd9a75c877f8cf93e4ccaf91a58cb34176d8b688cb14a17e28b9c1c1748af14d005bc5231180fed592a4143195b8010a1733e'
        };

        const rnd = await d.fetchRandomness();
        const valid = d.verifyRandomness(rnd, key);
        const valid2 = d.verifyRandomness(rnd, key2);

        console.log(key);
        console.log(key2);

        console.log(valid, valid2);
    });
})
