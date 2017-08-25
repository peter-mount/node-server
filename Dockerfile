FROM area51/node:8.2.1
MAINTAINER Peter Mount <peter@retep.org>

ENV SERVER_ETC /etc/server
ENV SERVER_DIR /opt/server
ENV SERVER_WEB /opt/www

VOLUME $SERVER_ETC
VOLUME $SERVER_WEB

# We need jq, may as well leave in the image
RUN apk --update add \
      jq &&\
    rm -rf /var/cache/apk/*

ADD . /tmp

COPY server.yaml $SERVER_ETC/server.yaml

RUN mkdir -p \
      $SERVER_ETC \
      $SERVER_ETC/server \
      $SERVER_ETC/conf \
      $SERVER_DIR \
      $SERVER_WEB &&\
    cd /tmp &&\
    npm install &&\
    node ./node_modules/babel-cli/bin/babel.js \
      --plugins transform-es2015-modules-umd \
      src \
      --ignore __tests__ \
      --out-dir $SERVER_DIR &&\
    jq '{"name":.name,"version":.version,"private":true,"dependencies":.dependencies}' \
      <package.json \
      >$SERVER_DIR/package.json &&\
    cd $SERVER_DIR &&\
    npm install &&\
    rm -rf /tmp/*

WORKDIR /opt/server
CMD ["node","index.js"]
