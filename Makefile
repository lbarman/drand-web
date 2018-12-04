.PHONY: test all clean

DRANDJS_BIN=drandjs/dist/drand.js

$(DRANDJS_BIN):
	$(MAKE) -C drandjs build

test:
	$(MAKE) -C drandjs test

all: 
	$(MAKE) -C drandjs test
	$(MAKE) $(DRANDJS_BIN)
	cp $(DRANDJS_BIN) web/

clean:
	rm -rf drandjs/node_modules
	rm -rf drandjs/dist/*