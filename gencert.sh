#!/bin/bash

cd lib/server

openssl genrsa \
  -des3 \
  -passout pass:x \
  -out server.pass.key 2048

openssl rsa \
  -passin pass:x \
  -in server.pass.key \
  -out server.key

rm server.pass.key

echo "Generated [36mserver.key[39m"

openssl req \
  -new \
  -key server.key \
  -subj "/C=UK/ST=Kent/O=Area51/CN=localhost" \
  -out server.csr
  
echo "Generated [36mserver.csr[39m"

openssl x509 \
  -req -sha256 \
  -extfile <(printf "subjectAltName=DNS:localhost,DNS:localhost.localhost") \
  -days 365 \
  -in server.csr \
  -signkey server.key \
  -out server.crt

echo "Generated [36mserver.crt[39m"
