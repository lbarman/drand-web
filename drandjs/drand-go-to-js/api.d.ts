declare namespace api {
    function Verify(
         previous: string,
         randomness: string,
         round: string,
         pubKey: string
     ): boolean;
}

export = api