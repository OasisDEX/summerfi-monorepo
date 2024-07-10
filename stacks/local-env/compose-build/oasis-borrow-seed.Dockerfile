FROM postgres:alpine

ADD /compose-build/oasis-borrow-seed/1_schema.sql /docker-entrypoint-initdb.d
ADD /compose-build/oasis-borrow-seed/2_data.sql /docker-entrypoint-initdb.d

RUN chmod a+r /docker-entrypoint-initdb.d/*
