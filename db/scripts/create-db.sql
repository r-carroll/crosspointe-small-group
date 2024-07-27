create table if not exists prayers (
    id serial primary key,
    groupname varchar(25),
    duration numeric not null,
    submitted_time timestamp
);

create table if not exists reading (
    id serial primary key,
    groupname varchar(25),
    duration numeric not null,
    submitted_time timestamp,
    passage varchar(25)
);