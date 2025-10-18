-- Comandi SQL per inserire i file dei tour nella tabella tour_files
-- Generato automaticamente il 18/10/2025 20:00:28

-- NOTA: Questi INSERT assumono che i file siano già stati caricati nel vector store OpenAI
-- Il campo vector_store_file_id deve essere aggiornato manualmente con gli ID reali

INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES (1, 'tour_1_HARLEYTOURINSANFRANC.txt', NULL, NOW(), NOW());
INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES (2, 'tour_2_CITYBREAKNEWYORK.txt', NULL, NOW(), NOW());
INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES (3, 'tour_3_fly-drive-canada-rockies.txt', NULL, NOW(), NOW());
INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES (4, 'tour_4_tour-guidato-messico-yucatan.txt', NULL, NOW(), NOW());
INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES (5, 'tour_5_luxury-travel-polinesia-francese.txt', NULL, NOW(), NOW());
INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES (7, 'tour_7_luxury-travel-polinesia-francese (Copia).txt', NULL, NOW(), NOW());
INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES (9, 'tour_9_fly--drive-in-messico.txt', NULL, NOW(), NOW());

-- Totale: 7 record da inserire
