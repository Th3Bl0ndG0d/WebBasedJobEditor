# Web Based Job Editor (WBJE)
De Web Based Job Editor (WBJE) is een moderne React-applicatie gebouwd met Vite. 
De applicatie stelt gebruikers in staat om visueel jobs samen te stellen, cylinders en plates te creeeren. 
Inclusief ondersteuning voor gebruikersauthenticatie, rol beheer en een gebruiksvriendelijke interface.

Hieronder is de belangrijkste pagina te zien van de WBJE, de job overzichts pagina:
![JobOverzicht.png](/src/assets/screenshots/JobOverzicht.png)


## Required .env data:
Copieer de bijgeleverde .env en plaats deze in de root. 
Hierin staan de belangrijke gegevens die nodig zijn om deze site te kunnen draaien. 
De API url en de bijbehordende Project_ID

- VITE_API_URL
- VITE_PROJECT_ID

## DB script uploaden in NoviAPI

Open de browser en ga naar: https://novi-backend-api-wgsgz.ondigitalocean.app/

* Gebruik de ![wbje_DataBase_Script.json](/src/assets/wbje_DataBase_Script.json)

Vul de gegevens in op de site, zoals als het voorbeeld.

![DBaanmaken.png](/src/assets/screenshots/DBaanmaken.png)

Druk vervolgens op de Upload API configuratie knop. Nu is de juiste database geladen.

## Installaties en hun betekenis:

- `npm install`  
  Initialiseert of actualiseert de `node_modules` map op basis van `package.json`. Installeert alle gedefinieerde dependencies.
- 
- `npm install react-router-dom`  
  Routerpakket voor React. Maakt navigatie tussen pagina’s mogelijk via routes zonder volledige pagina-herlaad.

- `npm install phosphor-react`  
  Iconenbibliotheek gebaseerd op Phosphor. Levert schaalbare SVG-iconen als herbruikbare React-componenten.

- `npm install axios`  
  Promise-gebaseerde HTTP-client. Wordt gebruikt om API-verzoeken te doen en responses af te handelen. Alternatief voor `fetch()` met meer functionaliteit.

- `npm install react-toastify`  
  Voor het tonen van notificaties (toasts) in React. Ondersteunt styling, positionering en automatische verberging.

- `npm install jwt-decode`  
  Decodeert JSON Web Tokens (JWT) aan de clientzijde. Wordt gebruikt om o.a. gebruikersrollen of vervaltijden uit tokens te halen.

- `npm audit fix`  
  Voert een beveiligingscontrole uit op je dependencies en lost automatisch bekende kwetsbaarheden op waar mogelijk.

- `npm fund`  
  Toont welke open source projecten financiering ontvangen of nodig hebben. Informatief, heeft geen invloed op je project.

## Visuele feedback mbv toast
Voor visuele feedback maakt de applicatie gebruik van `react-icons/fi` (Feather icons). 
Intern worden deze gemapt naar emoji-symbolen voor consistent gebruik in meldingen:

| Type     | Feather Icon     | Emoji |
|----------|------------------|-------|
| success  | `FiCheckCircle`  | ✅    |
| error    | `FiXCircle`      | ❌    |
| warning  | `FiAlertTriangle`| ⚠️    |
| info     | `FiInfo`         | ℹ️    |
| debug    | `FiTerminal`     | 🐞    |


## Applicatie starten:
Voer het volgende commando uit om de ontwikkelserver te starten:
- `npm run dev`

De applicatie draait standaard op:
http://localhost:5173

Inloggen in de WJBE
Bij het starten van de Web Based Job Editor (WBJE) word je automatisch doorgestuurd naar de loginpagina. 
Hier kun je inloggen met één van de twee standaard gebruikersaccounts: een operator of een beheerder (admin).


## Inloggen Operator

* Email:     operator@example.com
* Passwoord: operator

Na succesvolle login wordt de operator automatisch doorgestuurd naar de Job Overview-pagina.
Operators hebben beperkte rechten en kunnen bijvoorbeeld geen gebruikersrollen wijzigen.
![LoginOperator.png](/src/assets/screenshots/LoginOperator.png)


## Inloggen Administrator

* Email:     admin@example.com
* Passwoord: admin

Beheerders hebben uitgebreide rechten en worden na het inloggen direct doorgestuurd naar de Profielpagina. 
Zij kunnen o.a. gebruikersrollen aanpassen en volledige bewerkingen uitvoeren binnen het systeem.
![LoginAdministrator.png](/src/assets/screenshots/LoginAdministrator.png)

## JobOverzicht

Job Overview
Na het inloggen met een operator-account word je automatisch doorgestuurd naar de Job Overview-pagina.
Hier krijg je een overzicht van alle beschikbare jobs in het systeem.

Elke job bevat basisinformatie zoals:

Jobnummer
- Naam
- Datum
- Klantinformatie
- Aantal cilinders

Vanuit deze pagina kun je jobs selecteren, bekijken of (afhankelijk van je rol) bewerken en verwijderen.
De pagina vormt het centrale startpunt voor operators om snel toegang te krijgen tot jobs en bijbehorende cylinders 
en platen.
![JobOverzicht.png](/src/assets/screenshots/JobOverzicht.png)

In de Job Overview-pagina worden bij het selecteren van een job drie actie-iconen weergegeven:

**Edit**  _Opent de geselecteerde job om gegevens te bewerken._ (niet uitgewerkt)
**Copy**  _Maakt een exacte kopie van de job._ (niet uitgewerkt)
**Delete**  _Verwijdert de job definitief uit het systeem._ (beschikbaar)

Deze iconen reageren onafhankelijk van het klikken op de rij zelf.
![JobSelecteren.png](/src/assets/screenshots/JobSelecteren.png)

De iconen zijn afkomstig uit react-icons/fi (Feather Icons) en worden gestyled via de klassen 
edit-icon, copy-icon en delete-icon.

## Job aanmaken

De New Job-pagina biedt de mogelijkheid om een compleet nieuwe job aan te maken.
Deze functie is beschikbaar voor zowel operators als beheerders.

De gebruiker voert eerst de benodigde gegevens in. Daarna wordt het aantal cylinders en het aantal platen per 
cylinder opgegeven.

![NewJob.png](/src/assets/screenshots/NewJob.png)

Velden die worden ingevoerd:

**Jobgegevens**
Jobnummer: _Unieke identificatiecode voor de job (bijv. JOB-001)._
Naam: _De interne of klantgerichte benaming van de job._
Info: _Vrij tekstveld voor aanvullende opmerkingen of instructies m.b.t. de job._

**Cylindergegevens**
Repeat: _De afwikkeling van de cylinder in millimeters. Dit geeft aan hoe lang het te bedrukken oppervlak is per omwenteling._

**Plategegevens**
Width: _De breedte van de plaat in millimeters._
TopHeight: _Hoogte van de plaat aan de bovenzijde, gemeten vanaf het middelpunt van de cylinder._
BottomHeight: _Hoogte aan de onderzijde, eveneens gemeten vanaf het middelpunt._
x: _Horizontale positie van de plaat op de cylinder (offset in mm)._
y: _Verticale positie van de plaat op de cylinder (offset in mm)._

**bepaal aantal cylinders en platen.**

Klok nu op **Genereer Job** Er wordt nu een overzicht getoond waarin alle gegenereerde cylinders en platen nog bewerkt 
kunnen worden voordat de job wordt opgeslagen. 

![NewJobOverzicht.png](/src/assets/screenshots/NewJobOverzicht.png)

Druk op **Creer Job** om de job daadwerkelijk naar de API te sturen voor opslag. 
Een toast melding zal een melding sturen dat het gelukt is.
![ToastJobIsAangemaakt.png](/src/assets/screenshots/ToastJobIsAangemaakt.png)

Via de link in de toast kom je direct terug naar de job overzicht. Hierin zie je nu de nieuwe job die is toegevoegd.
![BanaanJobInOverzicht.png](/src/assets/screenshots/BanaanJobInOverzicht.png)

