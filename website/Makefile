
TARGETS	= css/main.css

SASS	= sass --no-cache --style=compressed

all:	$(TARGETS)

clean:
	$(RM) $(TARGETS)

css/main.css:	css/main.scss
	$(SASS)	$^ $@

