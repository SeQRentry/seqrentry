
DESTDIR		= ../destdir
TARGETS		= css/main.css
FILES		= $(TARGETS) favicon.ico index.html $(wildcard gfx/*.png) $(wildcard js/*.js)

SASS		= sass --no-cache --style=compressed
INSTALL		= install

all:		$(TARGETS)

install:	all
	$(INSTALL) -d $(DESTDIR)/css $(DESTDIR)/gfx $(DESTDIR)/js

	for file in $(TARGETS) $(FILES); do \
		$(INSTALL) $$file $(DESTDIR)/$$file; \
	done

clean:
	$(RM) $(TARGETS)

css/main.css:	css/main.scss
	$(SASS)	$^ $@

