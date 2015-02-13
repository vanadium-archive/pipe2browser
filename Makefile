export PATH:=$(VANADIUM_ROOT)/environment/cout/node/bin:$(PWD)/node_modules/.bin:$(PATH)
export GOPATH=$(PWD)/go
export VDLPATH=$(GOPATH)

# All JS files except build.js and third party
JS_FILES = $(shell find browser -name "*.js" -a -not -name "build.js" -a -not -path "*third-party*")
# All HTML/CSS files except index.html and third party
HTML_FILES = $(shell find browser -name "*.css" -a -not -path "*third-party*" -o  -name "*.html" -a -not -name "index.html" -a -not -path "*third-party*")

# Builds everything
all: node_modules browser/third-party browser/third-party/veyron browser/build.js browser/index.html $(VANADIUM_ROOT)/release/go/bin

v-binaries:
# TODO(nlacasse): Only build the binaries we need.
	v23 go install v.io/...

# Build vdl.go
go/src/p2b/vdl/p2b.vdl.go: v-binaries
	vdl generate -lang=go p2b/vdl

# Compile p2b cli binary
go/bin/p2b: go/src/p2b/main.go go/src/p2b/vdl/p2b.vdl.go
	v23 go install p2b/...

# Install what we need from NPM, tools such as jspm, serve, etc...
node_modules: package.json
	npm prune
	npm install
	touch node_modules

# Install JSPM and Bower packages as listed in browser/package.json from JSPM and browser/bower.json from bower
browser/third-party: browser/package.json browser/bower.json node_modules
	cd browser && \
	jspm install -y
# Link a local copy of veyron.js.
# TODO(nlacasse): Remove this and put veyron.js in package.json once we can get
# it from npm
	cd $(VANADIUM_ROOT)/release/javascript/core && \
	jspm link -y npm:veyronjs@0.0.1
	cd browser && \
	jspm install -y -link npm:veyronjs && \
	bower prune && \
	bower install
	touch browser/third-party

# Bundle whole app and third-party JavaScript into a single build.js
browser/build.js: $(JS_FILES) browser/third-party node_modules
	cd browser; \
	jspm setmode local; \
	jspm bundle app build.js

# Bundle all app web components and third-party web components into a single index.html
browser/index.html: $(HTML_FILES) browser/build.js node_modules
	cd browser; \
	vulcanize -o index.html app.html

# Serve
start: browser/index.html
	serve browser/. --port 8000

# Continuously watch for changes to .js, .html or .css files.
# Rebundle the appropriate file (build.js and/or index.html) when local files change
watch:
	watch -n 1 make

# Clean all build artifacts
clean:
	rm -rf browser/third-party
	rm -rf node_modules
	rm -f browser/index.html
	rm -f browser/build.js

.PHONY: start clean watch v-binaries