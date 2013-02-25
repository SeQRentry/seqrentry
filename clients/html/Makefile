
DESTDIR		= ../../destdir
FILES		= $(TARGETS) button.png spinner.gif

VERSION		= 0.9
TARGETS_ORIG	= seqrentry.js seqrentry.css
TARGETS_MINI	= seqrentry-min.js seqrentry-min.css
TARGETS		= $(TARGETS_ORIG) $(TARGETS_MINI)

CURL		= curl
CLOSURE_LEVEL	= ADVANCED_OPTIMIZATIONS
CLOSURE  	= http://closure-compiler.appspot.com/compile
CSSMINIFIER	= http://www.cssminifier.com/raw
INSTALL		= install

orig:	$(TARGETS_ORIG)
mini:	$(TARGETS_MINI)
all:	orig mini

install:	all
	$(INSTALL) -d $(DESTDIR)/seqrentry-$(VERSION)

	for file in $(FILES); do \
		$(INSTALL) $$file $(DESTDIR)/seqrentry-$(VERSION); \
	done

clean:
	$(RM) $(TARGETS_ORIG) $(TARGETS_MINI)

seqrentry.js: base64.js qrcode.js sha256.js random.js main.js
	(echo '(function() {'; cat $^; echo '})();') > $@

seqrentry.css: main.css
	cat $^ > $@

seqrentry-min.js: seqrentry-$(VERSION).js
	$(CURL) --data compilation_level=$(CLOSURE_LEVEL) \
		--data output_format=text \
		--data output_info=compiled_code \
		--data-urlencode js_code@- \
		$(CLOSURE) < $< > $@

seqrentry-min.css: seqrentry-$(VERSION).css
	$(CURL) --data-urlencode input@- \
		$(CSSMINIFIER) < $< > $@
