insert into prayers (duration, submitted_time) 
    values (30, NOW()),
           (15, NOW() - interval '1 hour'),
           (15, NOW() - interval '2 hour'),
           (15, NOW() - interval '4 hour'),
           (45, NOW() - interval '15 minute');