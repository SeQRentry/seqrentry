
TARGETS	= main.css

SASS	= sass --no-cache

all:	$(TARGETS)

clean:
	$(RM) $(TARGETS)

main.css:	main.scss
	$(SASS)	$^ $@

