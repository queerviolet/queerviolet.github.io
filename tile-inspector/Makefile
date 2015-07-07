all: bundle.js

bundle.js: blob.js tile-inspector.js
	browserify tile-inspector.js > bundle.js

clean:
	rm -rf bundle.js

.PHONY: all clean