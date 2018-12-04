.PHONY: install cleanall build clean test

GO_SOURCE=drand-go-to-js/api.go 
GOPHERJS_TARGET=drand-go-to-js/api.js

TS_SOURCE=src/drand.ts
JS_TARGET=dist/drand.js

# installation
yarn.lock:
	yarn install

node_modules/built:
	yarn install
	touch node_modules/built

install: package.json yarn.lock
	$(MAKE) node_modules/built

cleanall:
	rm -rf node_modules
	rm -rf dist

# Create the JS bundle from the Go code
api: $(GOPHERJS_TARGET)

$(GOPHERJS_TARGET):
	gopherjs build --tags generic -o $(GOPHERJS_TARGET) $(GO_SOURCE)

# Create the JS source from TS
build: $(TS_SOURCE)

$(JS_TARGET): install $(TS_SOURCE) $(GOPHERJS_TARGET)
	node_modules/typescript/bin/tsc                      # no argument, everything is in "tsconfig.json"

clean:
	rm -f $(JS_TARGET)
	rm -f $(GOPHERJS_TARGET) $(GOPHERJS_TARGET).map

# Dev commands
run: $(JS_TARGET) $(GOPHERJS_TARGET)
	node_modules/node/bin/node $(JS_TARGET)

install-dev:
	yarn install --dev

test: node_modules/built
	cd drand-go-to-js && go test --race -v               # test go
	./node_modules/jest/bin/jest.js	                     # test TS/JS