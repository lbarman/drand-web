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
api:
	$(MAKE) $(GOPHERJS_TARGET)

$(GOPHERJS_TARGET):
	gopherjs build --tags generic -o $(GOPHERJS_TARGET) $(GO_SOURCE)

# Create the JS source from TS
build:
	$(MAKE) $(JS_TARGET)

$(JS_TARGET): install $(TS_SOURCE) $(GOPHERJS_TARGET)
	./node_modules/webpack/bin/webpack.js

# Administrative tasks
clean:
	rm -f $(JS_TARGET)
	rm -f $(GOPHERJS_TARGET) $(GOPHERJS_TARGET).map

test: node_modules/built
	./node_modules/tslint/bin/tslint -p .                # test TS/JS lint
	cd drand-go-to-js && go test --race -v               # test go
	./node_modules/jest/bin/jest.js	                     # test TS/JS