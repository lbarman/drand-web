// Credits to PizzaWhisperer <github.com/PizzaWhisperer/drandjs>

package main

import (
	"bytes"
	"encoding/binary"
	"strconv"
	"encoding/base64"
	//"encoding/hex"

	"github.com/dedis/kyber/pairing/bn256"
	"github.com/dedis/kyber/sign/bls"
	"github.com/gopherjs/gopherjs/js"
)

// Message returns a slice of bytes as the message to sign or to verify
// alongside a beacon signature.
func Message(prevRand []byte, round uint64) []byte {
	var buff bytes.Buffer
	binary.Write(&buff, binary.BigEndian, round)
	buff.Write(prevRand)
	return buff.Bytes()
}

var suite = bn256.NewSuite()

// Verify previous, randomness and public_key are hexadecimal strings, round is a string representing an int
func Verify(previous string, randomness string, round string, pubKey string) bool {

	prev, err := base64.StdEncoding.DecodeString(previous)
	if err != nil {
		println("Can't base64-decode 'previous': ", err)
		return false
	}
	iround, err := strconv.Atoi(round)
	if err != nil {
		println("Can't parse uint64 'round': ", err)
		return false
	}
	msg := Message(prev, uint64(iround))

	data, err := base64.StdEncoding.DecodeString(pubKey)
	if err != nil {
		println("Can't base64-decode 'pubKey': ", err)
		return false
	}
	pub := suite.G2().Point()
	if err := pub.UnmarshalBinary(data); err != nil {
		println("Can't unmarshall 'pubKey' to group element: ", err)
		return false
	}

	sig, err := base64.StdEncoding.DecodeString(randomness)
	if err != nil {
		println("Can't base64-decode 'randomness': ", err)
		return false
	}

	//println("pub", hex.Dump(data))
	//println("prev", hex.Dump(prev))
	//println("sig", hex.Dump(sig))

	if err := bls.Verify(suite, pub, msg, sig); err != nil {
		println("BLS-verification failed: ", err)
		return false
	}
	return true
}

func main() {
	//js.Module is undefined because we are in a browser so can't call node.js js.Module
	js.Module.Get("exports").Set("Verify", Verify)
}
