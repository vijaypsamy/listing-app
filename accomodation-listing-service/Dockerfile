FROM centos

RUN yum install curl -y && \
     curl -sL https://rpm.nodesource.com/setup_12.x | bash - && \
     yum install -y nodejs


RUN mkdir -p /accomodation-listing-service
COPY  ./ /accomodation-listing-service/
RUN cd /accomodation-listing-service && npm install
WORKDIR /accomodation-listing-service
ENTRYPOINT ["npm","start"]

