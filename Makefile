SHELL := /bin/bash

server-start:
	symfony server:start --no-tls -d
	docker compose up -d
	symfony run -d bun run watch
.PHONY: server-start

server-stop:
	symfony server:stop
	docker compose stop
.PHONY: server-stop
