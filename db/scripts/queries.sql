select *, extract(hour from submitted_time) as hour from prayers where submitted_time is not null order by hour;
select *, extract(dow from submitted_time) as day from prayers where submitted_time is not null order by day;


select json_agg(subquery) as timespans from (select *, 
        extract(hour from submitted_time) as hour,
        extract(dow from submitted_time) as day
         from prayers where submitted_time is not null order by hour) as subquery;