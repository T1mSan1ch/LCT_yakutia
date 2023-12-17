create view vClient as
SELECT
    client.id AS id,
    client.dataset_id AS dataset_id,
    COUNT(*) AS text_count,
    COUNT(CASE WHEN text.is_good IS true THEN 1 END) AS good_count,
    COUNT(CASE WHEN text.is_good IS false THEN 1 END) AS bad_count,
    COUNT(CASE WHEN text.id IS NOT NULL and text.is_good IS null THEN 1 END) AS left_count
FROM client
FULL OUTER JOIN text ON client.id = text.client_id
GROUP BY client.id;
