-- Aggiunta HAWAII e ALASKA alle aree geografiche USA
-- Esegui solo se la colonna geographic_area è di tipo ENUM.
-- Se è VARCHAR/TEXT non è necessario: i valori sono già accettati.

-- Se geographic_area è ENUM, adatta il nome della tabella se diverso da 'tours':
ALTER TABLE tours
MODIFY COLUMN geographic_area ENUM(
  'EST', 'OVEST', 'EST E OVEST', 'SOUTH', 'MID WEST', 'HAWAII', 'ALASKA'
) NULL;

-- Se il tuo ENUM ha più valori o il nome della colonna è diverso (es. geographic_area),
-- usa questo schema e adatta l'elenco ai valori attuali presenti nel DB:
-- ALTER TABLE <nome_tabella> MODIFY COLUMN <nome_colonna> ENUM('EST','OVEST','EST E OVEST','SOUTH','MID WEST','HAWAII','ALASKA', ...) NULL;
