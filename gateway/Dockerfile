FROM centos

RUN yum install curl -y && \
     curl -sL https://rpm.nodesource.com/setup_12.x | bash - && \
     yum install -y nodejs


RUN mkdir -p /gateway
COPY  ./ /gateway/
RUN cd /gateway && npm install
WORKDIR /gateway
ENTRYPOINT ["npm","start"]

