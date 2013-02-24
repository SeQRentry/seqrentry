
TARGETS	= main.css

SASS	= sass --no-cache --style=compressed

all:	$(TARGETS)

clean:
	$(RM) $(TARGETS)

main.css:	main.scss
	$(SASS)	$^ $@

