FROM area51/arm64v8-node:8.2.1
MAINTAINER Peter Mount <peter@retep.org>

ENV SERVER_ETC /etc/server
ENV SERVER_DIR /opt/server
ENV SERVER_WEB /opt/www

VOLUME $SERVER_ETC
VOLUME $SERVER_WEB

ADD . /tmp

# Copy config to final location
ADD etc $SERVER_ETC

# We need jq, may as well leave in the image
# Also configure npm to use our repository
RUN echo "registry=https://npm.area51.onl/" > ~/.npmrc &&\
    apk --update add \
      jq &&\
    rm -rf /var/cache/apk/* &&\
    mkdir -p \
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
