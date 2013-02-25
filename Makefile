
all:

clean:
	cd website && $(MAKE) $(MFLAGS) $@
	cd clients/html && $(MAKE) $(MFLAGS) $@

install:
	cd website && $(MAKE) $(MFLAGS) $@
	cd clients/html && $(MAKE) $(MFLAGS) $@
