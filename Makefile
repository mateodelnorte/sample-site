
all: ; ${MAKE} -j4 proxy api site

api: 
	node api.js

proxy:
	node proxy.js

site:
	node app.js
