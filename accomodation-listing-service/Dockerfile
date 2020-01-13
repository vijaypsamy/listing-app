FROM centos

RUN yum install curl -y && \
     curl -sL https://rpm.nodesource.com/setup_12.x | bash - && \
     yum install -y nodejs


RUN mkdir /gateway
COPY  ./* /
RUN cd /gateway && npm install
ENTRYPOINT ["npm","start"]

