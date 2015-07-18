all: bundle.js

bundle.js: blob.js tile-inspector.js
	browserify tile-inspector.js > bundle.js
	node_modules/uglifyjs/bin/uglifyjs bundle.js -o bundle.js

clean:
	rm -rf bundle.js

.PHONY: all clean
