create table if not exists prayers (
    id serial primary key,
    duration numeric not null,
    submitted_time timestamp
);