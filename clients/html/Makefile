
VERSION		= 0.9
TARGETS_ORIG	= seqrentry-$(VERSION).js seqrentry-$(VERSION).css
TARGETS_MINI	= seqrentry-$(VERSION)-min.js seqrentry-$(VERSION)-min.css

CURL		= curl
CLOSURE_LEVEL	= ADVANCED_OPTIMIZATIONS
CLOSURE  	= http://closure-compiler.appspot.com/compile
CSSMINIFIER	= http://www.cssminifier.com/raw

orig:	$(TARGETS_ORIG)
mini:	$(TARGETS_MINI)
all:	orig mini

clean:
	$(RM) $(TARGETS_ORIG) $(TARGETS_MINI)

seqrentry-$(VERSION).js: base64.js qrcode.js sha256.js random.js main.js
	(echo '(function() {'; cat $^; echo '})();') > $@

seqrentry-$(VERSION).css: main.css
	cat $^ > $@

seqrentry-$(VERSION)-min.js: seqrentry-$(VERSION).js
	$(CURL) --data compilation_level=$(CLOSURE_LEVEL) \
		--data output_format=text \
		--data output_info=compiled_code \
		--data-urlencode js_code@- \
		$(CLOSURE) < $< > $@

seqrentry-$(VERSION)-min.css: seqrentry-$(VERSION).css
	$(CURL) --data-urlencode input@- \
		$(CSSMINIFIER) < $< > $@
