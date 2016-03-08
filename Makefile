NODE_DIR := $(shell jiri profile list --info Target.InstallationDir v23:nodejs)
export PATH:=$(NODE_DIR)/bin:$(CURDIR)/node_modules/.bin:$(PATH)
export GOPATH=$(CURDIR)/go
export VDLPATH=$(GOPATH)

# NOTE: we run npm using 'node npm' to avoid relying on the shebang line in the
# npm script, which can exceed the Linux shebang length limit on Jenkins.
NPM := $(NODE_DIR)/bin/npm

# All JS files except build.js and third party
JS_FILES = $(shell find browser -name "*.js" -a -not -name "build.js" -a -not -path "*third-party*")
# All HTML/CSS files except index.html and third party
HTML_FILES = $(shell find browser -name "*.css" -a -not -path "*third-party*" -o  -name "*.html" -a -not -name "index.html" -a -not -path "*third-party*")

all: build

# Builds everything
build: node_modules go/bin/p2b browser/third-party browser/build.js browser/index.html

# Compile p2b cli binary
go/bin/p2b: go/src/v.io/x/p2b/main.go go/src/v.io/x/p2b/vdl/p2b.vdl
	jiri go install v.io/x/p2b/...

# Install what we need from NPM, tools such as jspm, serve, etc...
node_modules: package.json
	:;node $(NPM) prune
	:;node $(NPM) install
	touch node_modules

# Link a local copy of vanadium.js.
# TODO(nlacasse): Remove this and put vanadium.js in package.json once we can get
# it from npm
browser/third-party/npm/vanadium@0.0.1: node_modules
	cd $(JIRI_ROOT)/release/javascript/core && \
	:;jspm link -y npm:vanadium@0.0.1
	cd browser && \
	:;jspm install -y -l npm:vanadium@0.0.1

# Install JSPM and Bower packages as listed in browser/package.json from JSPM and browser/bower.json from bower
browser/third-party: browser/third-party/npm/vanadium@0.0.1 browser/package.json browser/bower.json node_modules
	cd browser && \
	:;jspm install -y && \
	:;bower prune && \
	:;bower install
	touch browser/third-party

browser/services/v.io/x/p2b/vdl/index.js:
	jiri run vdl generate --lang=javascript --js-out-dir=browser/services v.io/x/p2b/vdl

# Bundle whole app and third-party JavaScript into a single build.js
browser/build.js: $(JS_FILES) browser/services/v.io/x/p2b/vdl/index.js browser/third-party node_modules
	cd browser; \
	:;jspm setmode local; \
	:;jspm bundle app build.js

# Bundle all app web components and third-party web components into a single index.html
browser/index.html: $(HTML_FILES) browser/build.js node_modules
	cd browser; \
	:;vulcanize -o index.html app.html

# Serve
start: build browser/index.html
	:;serve browser/. --port 8000

shell:
	jiri go install v.io/x/ref/cmd/principal v.io/x/ref/services/agent/agentd
	./shell.sh


# Continuously watch for changes to .js, .html or .css files.
# Rebundle the appropriate file (build.js and/or index.html) when local files change
watch:
	watch -n 1 make

# TODO(nlacasse): Write real tests.  For now just make sure that everything builds.
test: browser/index.html go/bin/p2b

# Clean all build artifacts
clean:
	rm -rf browser/build.js
	rm -rf browser/index.html
	rm -rf browser/third-party
	rm -rf go/{bin,pkg}
	rm -rf node_modules
	rm -rf credentials

.PHONY: start clean watch test
