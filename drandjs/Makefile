.PHONY: install cleanall build clean

SOURCE=drand.ts
TARGET=drand.js

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

# Create the JS source from TS
build: $(TARGET)

$(TARGET): install $(SOURCE)
	node_modules/typescript/bin/tsc $(SOURCE) --outFile $(TARGET)

clean:
	rm -f $(TARGET)

# Dev commands
run: $(TARGET)
	node_modules/typescript/bin/node $(TARGET)