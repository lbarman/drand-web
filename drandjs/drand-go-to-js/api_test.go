// Credits to PizzaWhisperer <github.com/PizzaWhisperer/drandjs>

package main

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestVerify(t *testing.T) {
	pubKey := "AR0KIcDRkod88ZlNp+XScSqHvJL/+tF68s4Csi8CugjoT4T9nM2xTm+SzOWmahBHttZoZ7ecr7MpSfax6LQOYdgyu97H+vG+kguEIAPm29mnXId/jPk+TMr5GljLNBdti2iMsUoX4oucHBdIrxTQBbxSMRgP7VkqQUMZW4AQoXM+"

	var round string = "13849"
	var previous string = "HwVwt4p8PjC/NQlT9MK4t9FUdQ5rF6YwB+QQxpYbPGoLayqNUH2ICArTff5h44oqR86pZQA/IC1YsGobVbmW3Q=="
	var randomness string = "AYNzlhdjSiT+3QtTMhpqiWQlNNVv+dxLZ+j+Kpo5gq0RxZrsNLsEYIT08cev8AXAzmgOSpNnthBeC5fZNkvWkg=="

	ok := Verify(previous, randomness, round, pubKey)
	require.True(t, ok)
}