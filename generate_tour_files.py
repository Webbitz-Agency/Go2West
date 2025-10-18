#!/usr/bin/env python3
"""
Script per generare file .txt per tutti i tour esistenti nel database Go2West
Questo script deve essere eseguito una sola volta per creare i file txt locali
con il formato standard che usa l'applicazione originale.

Autore: AI Assistant
Data: 2025-10-18
"""

import os
import sys
import pymysql
from datetime import datetime
from dotenv import load_dotenv
import json

# Carica le variabili d'ambiente
load_dotenv()

# Configurazione database
DB_CONFIG = {
    'host': 'db-mysql-fra1-09501-do-user-24280960-0.l.db.ondigitalocean.com',
    'port': 25060,
    'user': 'doadmin',
    'password': 'AVNS_q6pjJ1Aego6vWH4f1Wk',
    'database': 'defaultdb',
    'charset': 'utf8mb4',
    'ssl_disabled': False
}

def generate_tour_txt_content(tour_data):
    """
    Genera il contenuto del file .txt per un tour
    Replica esattamente la funzione generate_tour_txt_content() di app.py
    """
    content = f"""TOUR: {tour_data['title']}
CODICE: {tour_data['code']}
DESTINAZIONE: {tour_data['destination']}
TIPO DI VIAGGIO: {tour_data['type']}
DURATA: {tour_data['duration']} giorni
PREZZO MINIMO: €{tour_data['minPrice'] if tour_data['minPrice'] else 'Da definire'}

DESCRIZIONE:
{tour_data['description'] or 'Nessuna descrizione disponibile'}

"""

    # Programma
    if tour_data['program']:
        content += "PROGRAMMA DI VIAGGIO:\n"
        program = tour_data['program']
        if isinstance(program, str):
            try:
                program = json.loads(program)
            except:
                pass
        
        if isinstance(program, list):
            for i, day in enumerate(program, 1):
                if isinstance(day, dict):
                    content += f"Giorno {i}: {day.get('title', '')}\n"
                    content += f"{day.get('description', '')}\n\n"
                else:
                    content += f"Giorno {i}: {day}\n\n"
        else:
            content += f"{program}\n\n"

    # Itinerario
    if tour_data['itinerario']:
        content += f"ITINERARIO:\n{tour_data['itinerario']}\n\n"

    # Prezzi
    if tour_data['prices']:
        content += "PREZZI:\n"
        prices = tour_data['prices']
        if isinstance(prices, str):
            try:
                prices = json.loads(prices)
            except:
                pass
        
        if isinstance(prices, list):
            for price in prices:
                if isinstance(price, dict):
                    content += f"- {price.get('category', '')}: €{price.get('price', '')}\n"
                else:
                    content += f"- {price}\n"
        else:
            content += f"{prices}\n"
        content += "\n"

    # Incluso
    if tour_data['included']:
        content += "INCLUSO NEL PREZZO:\n"
        included = tour_data['included']
        if isinstance(included, str):
            try:
                included = json.loads(included)
            except:
                pass
        
        if isinstance(included, list):
            for item in included:
                content += f"- {item}\n"
        else:
            content += f"{included}\n"
        content += "\n"

    # Non incluso
    if tour_data['notIncluded']:
        content += "NON INCLUSO NEL PREZZO:\n"
        not_included = tour_data['notIncluded']
        if isinstance(not_included, str):
            try:
                not_included = json.loads(not_included)
            except:
                pass
        
        if isinstance(not_included, list):
            for item in not_included:
                content += f"- {item}\n"
        else:
            content += f"{not_included}\n"
        content += "\n"

    # Pasti
    if tour_data['pasti']:
        content += f"PASTI:\n{tour_data['pasti']}\n\n"

    # Date disponibili
    if tour_data['dates']:
        content += "DATE DISPONIBILI:\n"
        dates = tour_data['dates']
        if isinstance(dates, str):
            try:
                dates = json.loads(dates)
            except:
                pass
        
        if isinstance(dates, list):
            for date in dates:
                content += f"- {date}\n"
        else:
            content += f"{dates}\n"
        content += "\n"

    # Note
    if tour_data['notes']:
        content += f"NOTE AGGIUNTIVE:\n{tour_data['notes']}\n\n"

    # Stato promozione
    if tour_data['is_promotion']:
        content += "QUESTO TOUR È ATTUALMENTE IN PROMOZIONE!\n\n"

    # Date di creazione e aggiornamento
    created_at = tour_data['created_at']
    updated_at = tour_data['updated_at']
    
    if created_at:
        if isinstance(created_at, str):
            try:
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            except:
                created_at = None
        content += f"Creato il: {created_at.strftime('%d/%m/%Y') if created_at else 'N/A'}\n"
    else:
        content += "Creato il: N/A\n"
    
    if updated_at:
        if isinstance(updated_at, str):
            try:
                updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
            except:
                updated_at = None
        content += f"Ultimo aggiornamento: {updated_at.strftime('%d/%m/%Y') if updated_at else 'N/A'}\n"
    else:
        content += "Ultimo aggiornamento: N/A\n"

    return content

def connect_to_database():
    """Connette al database MySQL"""
    try:
        connection = pymysql.connect(**DB_CONFIG)
        print("✅ Connessione al database riuscita!")
        return connection
    except Exception as e:
        print(f"❌ Errore nella connessione al database: {e}")
        return None

def get_all_tours(connection):
    """Recupera tutti i tour dal database"""
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
            SELECT id, code, title, description, program, prices, included, 
                   notIncluded, duration, type, destination, notes, dates, 
                   minPrice, pasti, itinerario, is_promotion, created_at, updated_at
            FROM tours 
            ORDER BY id
            """
            cursor.execute(query)
            tours = cursor.fetchall()
            print(f"✅ Trovati {len(tours)} tour nel database")
            return tours
    except Exception as e:
        print(f"❌ Errore nel recupero dei tour: {e}")
        return []

def create_tour_files(tours):
    """Crea i file .txt per tutti i tour"""
    if not tours:
        print("❌ Nessun tour da processare")
        return []
    
    # Crea la directory per i file se non esiste
    output_dir = "tour_files"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"📁 Creata directory: {output_dir}")
    
    created_files = []
    
    for tour in tours:
        try:
            # Genera il nome del file con il formato standard
            filename = f"tour_{tour['id']}_{tour['code']}.txt"
            filepath = os.path.join(output_dir, filename)
            
            # Genera il contenuto del file
            content = generate_tour_txt_content(tour)
            
            # Scrivi il file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            created_files.append({
                'tour_id': tour['id'],
                'filename': filename,
                'filepath': filepath
            })
            
            print(f"✅ Creato file: {filename}")
            
        except Exception as e:
            print(f"❌ Errore nella creazione del file per tour {tour['id']}: {e}")
    
    return created_files

def generate_sql_commands(created_files):
    """Genera i comandi SQL per inserire i record nella tabella tour_files"""
    if not created_files:
        print("❌ Nessun file creato, nessun comando SQL da generare")
        return
    
    sql_file = "insert_tour_files.sql"
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write("-- Comandi SQL per inserire i file dei tour nella tabella tour_files\n")
        f.write("-- Generato automaticamente il " + datetime.now().strftime('%d/%m/%Y %H:%M:%S') + "\n\n")
        
        f.write("-- NOTA: Questi INSERT assumono che i file siano già stati caricati nel vector store OpenAI\n")
        f.write("-- Il campo vector_store_file_id deve essere aggiornato manualmente con gli ID reali\n\n")
        
        for file_info in created_files:
            sql = f"""INSERT INTO tour_files (tour_id, filename, vector_store_file_id, created_at, updated_at) 
VALUES ({file_info['tour_id']}, '{file_info['filename']}', NULL, NOW(), NOW());"""
            f.write(sql + "\n")
        
        f.write(f"\n-- Totale: {len(created_files)} record da inserire\n")
    
    print(f"✅ Generato file SQL: {sql_file}")
    print(f"📝 Contiene {len(created_files)} comandi INSERT")

def main():
    """Funzione principale"""
    print("🚀 Avvio script di generazione file tour...")
    print("=" * 50)
    
    # Connetti al database
    connection = connect_to_database()
    if not connection:
        sys.exit(1)
    
    try:
        # Recupera tutti i tour
        tours = get_all_tours(connection)
        
        if not tours:
            print("❌ Nessun tour trovato nel database")
            sys.exit(1)
        
        # Crea i file .txt
        print("\n📝 Creazione file .txt...")
        created_files = create_tour_files(tours)
        
        # Genera i comandi SQL
        print("\n🗃️ Generazione comandi SQL...")
        generate_sql_commands(created_files)
        
        print("\n" + "=" * 50)
        print("✅ Script completato con successo!")
        print(f"📁 File creati in: ./tour_files/")
        print(f"🗃️ Comandi SQL in: ./insert_tour_files.sql")
        print(f"📊 Totale tour processati: {len(created_files)}")
        
    except Exception as e:
        print(f"❌ Errore durante l'esecuzione: {e}")
        sys.exit(1)
    
    finally:
        connection.close()
        print("🔌 Connessione database chiusa")

if __name__ == "__main__":
    main()
