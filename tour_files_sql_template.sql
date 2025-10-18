-- ============================================================================
-- COMANDI SQL PER INSERIRE I FILE DEI TOUR NELLA TABELLA tour_files
-- ============================================================================
-- 
-- ISTRUZIONI:
-- 1. Esegui prima lo script Python generate_tour_files.py
-- 2. Carica i file .txt generati nel vector store OpenAI
-- 3. Sostituisci i placeholder 'FILE_ID_X' con gli ID reali del vector store
-- 4. Esegui questi comandi SQL nel database
--
-- Generato il: 18/10/2025
-- ============================================================================

-- Verifica che la tabella tour_files esista
SELECT COUNT(*) as tours_count FROM tours;
SELECT COUNT(*) as tour_files_count FROM tour_files;

-- ============================================================================
-- TEMPLATE PER GLI INSERT - DA PERSONALIZZARE CON GLI ID REALI
-- ============================================================================

-- ESEMPIO DI COME DOVREBBERO ESSERE I COMANDI:
-- INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
-- VALUES (1, 'tour_1_usa-coast-to-coast.txt', 'file-abc123def456', NOW(), NOW());

-- ============================================================================
-- COMANDI PER VERIFICARE I TOUR ESISTENTI
-- ============================================================================

-- Mostra tutti i tour con i loro ID e codici (per riferimento)
SELECT 
    id,
    code,
    title,
    CONCAT('tour_', id, '_', code, '.txt') as expected_filename
FROM tours 
ORDER BY id;

-- ============================================================================
-- COMANDI PER INSERIRE I RECORD (DA PERSONALIZZARE)
-- ============================================================================

-- NOTA: Sostituisci questi placeholder con i dati reali dopo aver eseguito lo script Python

-- Per ogni tour, esegui un comando come questo:
-- INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
-- VALUES ([TOUR_ID], 'tour_[TOUR_ID]_[TOUR_CODE].txt', '[VECTOR_STORE_FILE_ID]', NOW(), NOW());

-- ============================================================================
-- ESEMPIO DI BATCH INSERT (se hai molti tour)
-- ============================================================================

-- Puoi anche usare un INSERT multiplo:
/*
INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) VALUES
(1, 'tour_1_codice1.txt', 'file-id-1', NOW(), NOW()),
(2, 'tour_2_codice2.txt', 'file-id-2', NOW(), NOW()),
(3, 'tour_3_codice3.txt', 'file-id-3', NOW(), NOW());
-- ... continua per tutti i tour
*/

-- ============================================================================
-- COMANDI DI VERIFICA POST-INSERIMENTO
-- ============================================================================

-- Verifica che tutti i tour abbiano un file associato
SELECT 
    t.id,
    t.code,
    t.title,
    tf.filename,
    tf.vector_store_file_id,
    CASE 
        WHEN tf.id IS NULL THEN 'MANCANTE'
        WHEN tf.vector_store_file_id IS NULL THEN 'SENZA VECTOR_ID'
        ELSE 'OK'
    END as status
FROM tours t
LEFT JOIN tour_files tf ON t.id = tf.tour_id
ORDER BY t.id;

-- Conta i tour senza file
SELECT COUNT(*) as tours_without_files
FROM tours t
LEFT JOIN tour_files tf ON t.id = tf.tour_id
WHERE tf.id IS NULL;

-- ============================================================================
-- COMANDI PER CORREGGERE EVENTUALI PROBLEMI
-- ============================================================================

-- Se devi aggiornare un vector_store_file_id:
-- UPDATE tour_files 
-- SET vector_store_file_id = 'nuovo-file-id', updated_at = NOW() 
-- WHERE tour_id = [TOUR_ID];

-- Se devi rimuovere un record duplicato:
-- DELETE FROM tour_files WHERE id = [ID_DA_ELIMINARE];

-- Se devi ricreare tutti i record (ATTENZIONE: elimina tutto):
-- DELETE FROM tour_files;
-- -- Poi reinserisci tutti i record con i comandi INSERT sopra

-- ============================================================================
-- FINE FILE
-- ============================================================================
