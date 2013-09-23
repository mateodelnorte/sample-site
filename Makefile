DEBUG=site*,api*,proxy*
API_PORT=3002
PROXY_PORT=80
RABBITMQ_URL=amqp://localhost:5672
SITE_PORT=3001

start: ; ${MAKE} -j4 proxy api site

api: 
	DEBUG=$(DEBUG) \
	PORT=$(API_PORT) \
	RABBITMQ_URL=$(RABBITMQ_URL) \
	node api.js

proxy:
	DEBUG=$(DEBUG) \
	API_PORT=$(API_PORT) \
	PROXY_PORT=$(PROXY_PORT) \
	RABBITMQ_URL=$(RABBITMQ_URL) \
	SITE_PORT=$(SITE_PORT) \
	node proxy.js

site:
	DEBUG=$(DEBUG) \
	PORT=$(SITE_PORT) \
	RABBITMQ_URL=$(RABBITMQ_URL) \
	node app.js
