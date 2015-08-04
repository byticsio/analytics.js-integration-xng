DUO = node_modules/.bin/duo
ESLINT = node_modules/.bin/eslint

SRC = lib/index.js


node_modules: package.json $(wildcard node_modules/*/package.json)
	@npm install


clean:
	rm -rf build.js
.PHONY: clean


distclean: clean
	rm -rf components node_modules
.PHONY: distclean


build.js: node_modules component.json $(SRC)
	@$(DUO) --use duo-babel --stdout lib/index.js > $@


build: build.js
.DEFAULT_GOAL = build


lint: node_modules
	@$(ESLINT) $(SRCS) $(TESTS)
.PHONY: lint
