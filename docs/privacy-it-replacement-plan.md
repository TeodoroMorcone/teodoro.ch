# Piano di sostituzione Privacy (IT)

Data: 10 novembre 2025

## Obiettivo
Allineare la sezione "Informativa privacy" in `content/i18n/it/landing.json` alla nuova versione completa fornita (19 sezioni + Appendici A/B), garantendo parità con i contenuti DE/EN aggiornati e consistenza terminologica.

## Struttura target
1. **Chi è responsabile?**  
   - Inserire i dati di contatto completi (indirizzo, UID, email, telefono).  
   - Nota sull'assenza del DPO.

2. **Ambito di applicazione e basi giuridiche**  
   - Evidenziare revDSG per CH e basi GDPR (Art. 6(1)(a-b-c-f)) per UE/SEE.  
   - Spiegare i contesti: visita sito, richieste, prenotazioni, lezioni Zoom, pagamenti.

3. **Quali dati tratto? (suddivisi in 6 sotto-categorie)**  
   - 3.1 Stammdaten → "Dati anagrafici".  
   - 3.2 Kommunikationsdaten → "Dati di comunicazione".  
   - 3.3 Unterrichtsdaten → "Dati didattici".  
   - 3.4 Vertrags-/Zahlungsdaten → "Dati contrattuali/pagamenti".  
   - 3.5 Technische Daten & Logfiles → "Dati tecnici & logfiles".  
   - 3.6 Consent-Daten → "Dati di consenso".  
   - Indicare che categorie speciali non vengono trattate intenzionalmente.

4. **Finalità e basi giuridiche**  
   - Elencare gli scopi (richieste, lezioni, pagamenti, sicurezza IT, qualità, usi basati su consenso).  
   - Evidenziare l'uso di legittimo interesse & consenso come basi legali.

5. **Su quali basi giuridiche?**  
   - Riprendere elenco Art. 6(1) lett. b/c/f/a in stile italiano.

6. **Origine dei dati**  
   - Dati forniti da studenti/tutori + log tecnici generati dai sistemi.

7. **Destinatari & incaricati**  
   - Elenco puntato dei fornitori con descrizione, sede, ruolo e strumenti giuridici (Hosting, Calendesk, Zoom, Stripe, Google Workspace/Gmail, GA4, Meta Pixel, piattaforme esterne).  
   - Citare SCC/garanzie per paesi terzi.

8. **Trasferimenti all'estero**  
   - Riferimento a decisioni di adeguatezza e SCC.  
  - Evidenziare rischio residuo per alcuni paesi terzi.

9. **Conservazione & cancellazione**  
   - Lista scadenze: richieste (12 mesi), dossier attivi (3 anni), contabilità (10 anni), log consenso (5 anni), log sicurezza (12 mesi), ciclo backup.

10. **Cookie, Local Storage & Tracking**  
    - Spiegare opt-in, categorie (essenziali, funzionali, analytics, marketing), note su GA4 e Meta Pixel.

11. **Lezioni online (Zoom) & registrazioni**  
    - Percentuale 100% online, sicurezza (waiting room, passcode), policy registrazioni (solo con consenso, cancellazione entro 30 giorni).

12. **Comunicazione & canali**  
    - Email/telefono standard; WhatsApp solo per scheduling, evitare dati sensibili; moduli/Calendesk in data center UE.

13. **Sicurezza dei dati**  
    - Elenco misure tecniche/organizzative (TLS, IP troncati, controlli accesso, logging, backup, need-to-know).

14. **Diritti degli interessati**  
    - Lista completa diritti (accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, revoca).  
    - Indicazioni su verifica identità, SLA 30 giorni (+30).  
    - Autorità competenti (IFPDT, autorità UE/SEE).

15. **Minorenni**  
    - Necessità di consenso genitori, uso limitato di nomi completi in Zoom.

16. **Decisioni automatizzate/Profilazione**  
    - Dichiarare l'assenza di tali trattamenti.

17. **Obbligo di fornire i dati?**  
    - Spiegare dati necessari (contatto, scheduling, pagamento) vs consensi opzionali.

18. **Modifiche della dichiarazione**  
    - Versioning collegato alla data.

19. **Contatto privacy**  
    - Ripetere recapiti ufficiali.

### Appendice A
- Tabella sintetica dei fornitori con colonne "Servizio", "Scopo", "Sede/Dati", "Base legale" (contratto/SCC).  
- Includere nota su potenziali sub-incaricati.

### Appendice B
- Categorie cookie con esempi di dati raccolti.  
- Ribadire possibilità di gestione tramite banner/consent manager.

## Terminologia chiave
- revDSG → "LPD riveduta (revDSG)".  
- Legitimate interests → "interessi legittimi".  
- Data subject rights → "diritti degli interessati".  
- Wait for 30 days extension wording come in DE/EN.  
- Consistency per "consenso" vs "opt-in" (mantenere entrambi se necessario, spiegare all'interno).  
- Usare maiuscole per sezioni (es. "Informativa privacy") coerenti con UI.

## Prossimi passi
1. Tradurre ogni sezione con tono legale chiaro, rispettando la struttura di elenco.  
2. Validare testo con terminologia coerente rispetto a DE/EN.  
3. Sostituire blocco `privacy` in `content/i18n/it/landing.json`.  
4. Eseguire lint/build per confermare validità JSON e rendering componenti.