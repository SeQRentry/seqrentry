
CURL	= curl
LEVEL	= ADVANCED_OPTIMIZATIONS
CLOSURE	= http://closure-compiler.appspot.com/compile

all:	seqrentry.js

clean:
	$(RM) seqrentry.js seqrentry-all.js

seqrentry.js: base64.js qrcode.js sha256.js main.js 
	cat $^ | \
	$(CURL) --data compilation_level=$(LEVEL) \
		--data output_format=text \
		--data output_info=compiled_code \
		--data-urlencode 'output_wrapper=(function() {%output%})();' \
		--data-urlencode js_code@- \
		$(CLOSURE) > $@
