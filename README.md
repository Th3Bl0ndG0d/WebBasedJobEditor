# Web Based Job Editor (WBJE)

## Inhoudsopgave

- [Introductie](#Inleiding)
- [Benodigdheden uit `.env`](#required-env-data)
- [Database script uploaden](#db-script-uploaden-in-noviapi)
- [Installaties en hun betekenis](#installaties-en-hun-betekenis)
- [Toasts en iconen](#visuele-feedback-mbv-toast)
- [Applicatie starten](#applicatie-starten)
- [Inloggen als operator](#inloggen-operator)
- [Inloggen als beheerder](#inloggen-administrator)
- [Job overzicht](#joboverzicht)
- [Job bewerken](#job-bewerken)
- [Job verwijderen](#job-verwijderen)
- [Job aanmaken](#job-aanmaken)
- [Nieuwe gebruiker via loginpagina](#nieuwe-gebruiker-toevoegen-vanuit-login-scherm)
- [Nieuwe gebruiker via profielpagina (admin)](#nieuwe-gebruiker-toevoegen-vanuit-de-profiel-pagina-alleen-beschikbaar-voor-beheerders)
- [Profiel bewerken als operator](#gebruiker-profiel-bewerken-vanuit-de-profiel-pagina-operator)
- [Profiel bewerken of verwijderen als admin](#gebruiker-profiel-bewerken-vanuit-de-profiel-pagina-administrator)

# Inleiding
De Web Based Job Editor (WBJE) is een moderne React-applicatie. De applicatie stelt gebruikers in staat om visueel jobs 
samen te stellen, cilinders en platen te creëren. Inclusief ondersteuning voor gebruikersauthenticatie, rol beheer en 
een gebruiksvriendelijke interface.

De Github repository is terug te vinden via de volgende link:

https://github.com/Th3Bl0ndG0d/WebBasedJobEditor

Hieronder is de belangrijkste pagina te zien van de WBJE, de job overzicht pagina:

![JobOverzicht.png](/src/assets/screenshots/JobOverzicht.png)


## Required .env data:
Kopieer de bijgeleverde .env _file_ en plaats deze in de root. Zoals de volgende afbeelding.

![envLocation.png](/src/assets/screenshots/envLocation.png)

Hierin staan de belangrijke gegevens die nodig zijn om deze site te kunnen draaien. 
De API url en de bijbehorende  Project_ID

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

Bij het starten van de Web Based Job Editor **(WBJE)** word je automatisch doorgestuurd naar de **loginpagina**. 
Hier kun je inloggen met één van de twee standaard gebruikersaccounts: een **operator** of een **beheerder** (admin).


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

![LoginAdmin.png](/src/assets/screenshots/LoginAdmin.png)

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

- **Edit**  _Opent de geselecteerde job om gegevens te bewerken. (niet compleet uitgewerkt)_
- **Copy**  _Maakt een exacte kopie van de job. (niet uitgewerkt)_
- **Delete**  _Verwijdert de job definitief uit het systeem. (beschikbaar)_

Deze iconen reageren onafhankelijk van het klikken op de rij zelf.

![JobSelecteren.png](/src/assets/screenshots/JobSelecteren.png)

De iconen zijn afkomstig uit react-icons/fi (Feather Icons) en worden gestyled via de klassen
edit-icon, copy-icon en delete-icon.

## Job bewerken

De job overzicht pagina biedt een functie waarbij je de job kan **bewerken** Hiervoor selecteer je de gewenste job, en 
druk je op het **edit** icoon.

![Edit.png](/src/assets/screenshots/Edit.png)

Nu wordt er een nieuwe pagina geladen waarin de complete job weergegeven wordt in een .json formaat. 

![jsonOverzichtBanaanJob.png](/src/assets/screenshots/jsonOverzichtBanaanJob.png)

Dit is in hoever deze functie is uitgewerkt. Selecteer job overzicht in de navigatie balk om terug te gaan.

## Job verwijderen

De job overzicht pagina biedt een functie waarbij je de job kan **verwijderen** Hiervoor selecteer je de gewenste job, 
en druk je op het **delete** icoon.

![DeleteJob.png](/src/assets/screenshots/DeleteJob.png)

Vervolgens wordt er middels een toast weergegeven dat de job verwijderd wordt uit de database. Afhankelijk van welke 
debug instellingen aanstaan in het project worden er evt. meerdere toast berichten weergegeven.

![ToastVerzoekTotVerwijderenJob.png](/src/assets/screenshots/ToastVerzoekTotVerwijderenJob.png)

Nadat de complete job verwijderd is wordt de job overzicht opnieuw geladen. Je zult nu zien dat de job ook echt is
verwijderd.

![JobOverZichtZonderBanaanJob.png](/src/assets/screenshots/JobOverZichtZonderBanaanJob.png)

## Job aanmaken

De New Job-pagina biedt de mogelijkheid om een compleet nieuwe job aan te maken. Deze functie is beschikbaar voor zowel 
operators als beheerders.

De gebruiker voert eerst de benodigde gegevens in. Daarna wordt het aantal cilinders en het aantal platen per 
cilinder opgegeven.

![NewJob.png](/src/assets/screenshots/NewJob.png)

Velden die worden ingevoerd:

**Jobgegevens**
- Jobnummer: _Unieke identificatiecode voor de job (bijv. JOB-001)._
- Naam: _De interne of klantgerichte benaming van de job._
- Info: _Vrij tekstveld voor aanvullende opmerkingen of instructies m.b.t. de job._

**Cilindergegevens**
- Repeat: _De afwikkeling van de cilinder in millimeters._ 

**Plategegevens**
- Width: _De breedte van de plaat in millimeters._
- TopHeight: _Hoogte van de plaat aan de bovenzijde, gemeten vanaf het middelpunt van de cilinder._
- BottomHeight: _Hoogte aan de onderzijde, eveneens gemeten vanaf het middelpunt._
- x: _Horizontale positie van de plaat op de cilinder (offset in mm)._
- y: _Verticale positie van de plaat op de cilinder (offset in mm)._

**bepaal aantal cylinders en platen.**

Klok nu op **Genereer Job** Er wordt nu een overzicht getoond waarin alle gegenereerde cilinders en platen nog bewerkt 
kunnen worden voordat de job wordt opgeslagen.

![NewJobOverzicht.png](/src/assets/screenshots/NewJobOverzicht.png)

Druk op **Creëer Job** om de job daadwerkelijk naar de API te sturen voor opslag. 
Een toast melding zal een melding sturen dat het gelukt is.

![ToastJobIsAangemaakt.png](/src/assets/screenshots/ToastJobIsAangemaakt.png)

Via de link in de toast kom je direct terug naar de job overzicht. Hierin zie je nu de nieuwe job die is toegevoegd.

![BanaanJobInOverzicht.png](/src/assets/screenshots/BanaanJobInOverzicht.png)

## Nieuwe gebruiker toevoegen vanuit login scherm
Wanneer nog geen gebruikers bestaan in het systeem, biedt het login scherm de mogelijkheid om de eerste gebruiker aan 
te maken. Deze eerste gebruiker krijgt automatisch de rol van operator. Dit zorgt ervoor dat het systeem veilig en 
beheersbaar kan worden opgestart.

Zorg ervoor dat je niet ingelogd bent. Of de applicatie voor het eerst opstart. Druk nu op **Nieuwe gebruiker aanmaken** 
op de login pagina.

![LoginOperator.png](/src/assets/screenshots/LoginOperator.png)

Vervolgens word je doorgestuurd naar de registratie pagina van de WBJE

![GebruikerRegisterenVanuitLoginForm.png](/src/assets/screenshots/GebruikerRegisterenVanuitLoginForm.png)

Voer nu een **email** adres in en een **wachtwoord** naar keuze. Druk vervolgens op **aanmaken** om een gebruiker te
registreren. Er zit hier geen verdere controle op de gegevens die ingevoerd worden. Dubbele gebruikers worden niet
afgevangen. Druk op **annuleren** om terug te gaan naar het inlog scherm. Na het succesvol registeren van een nieuwe 
gebruiker, word je automatisch ingelogd en doorgestuurd naar de job overzicht pagina.

## Nieuwe gebruiker toevoegen vanuit de profiel pagina (alleen beschikbaar voor beheerders)

Beheerders kunnen op hun profielpagina extra gebruikers toevoegen. Hierbij kunnen zij een email adres, wachtwoord 
en rol _(operator, beheerder of programmeur)_ instellen. Deze functionaliteit is enkel zichtbaar en toegankelijk voor 
gebruikers met de rol beheerder, zodat rechten en toegang zorgvuldig beheerd kunnen worden. 

Log in als admin@example.com hiermee word je direct doorgestuurd naar de profiel pagina.

![GebruikerRegisterenVanuitProfileForm.png](/src/assets/screenshots/GebruikerRegisterenVanuitProfileForm.png)

Selecteer **--Nieuwe gebruiker toevoegen** in de dropdown. Voer nu een **email** adres in en een **wachtwoord** naar 
keuze, selecteer vervolgend de **Rol** die je wilt toekennen aan deze nieuwe gebruiker. Druk vervolgens op **aanmaken** 
om een gebruiker te registreren. Ook hier zit geen verdere controle op de gegevens die ingevoerd worden. Dubbele 
gebruikers worden niet afgevangen. Druk op **annuleren** om terug te gaan naar het inlog scherm. Na het succesvol 
registeren van een nieuwe gebruiker, wordt deze automatisch toegevoegd in de gebruikers overzicht dropdown lijst.

## Gebruiker profiel bewerken vanuit de profiel pagina (operator)

Als default (operator) gebruiker kan je alleen je eigen **Email** en **Wachtwoord** wijzigen. Ga hiervoor naar de velden
die je wilt wijzigen. Breng de wijzigingen aan en druk op **opslaan**

![ProfielBewerkenOperator.png](/src/assets/screenshots/ProfielBewerkenOperator.png)

Je zult zien dat er niets gebeurt. Deze functie is niet geïmplementeerd. Druk op **annuleren** om terug te gaan naar het 
job overzicht scherm.

## Gebruiker profiel bewerken vanuit de profiel pagina (administrator)

Selecteer een gebruiker vanuit de dropdown. 

![GebruikerSelecterenViaDropDown.png](/src/assets/screenshots/GebruikerSelecterenViaDropDown.png)

Nu kan je de **email** en **wachtwoord** wijzigen samen met de **rol**. indien gewenst. Voor de **rol** dien je de 
dropdown te gebruiken

![RolVeranderenGebruiker.png](/src/assets/screenshots/RolVeranderenGebruiker.png)

Je hebt nu de mogelijkheid om de **wijzingen** te opslaan of om de gebruiker te **verwijderen**. Druk hiervoor op de 
gewenste knop. Echter zijn beide functies niet geïmplementeerd. Dus hiervoor wordt een melding weergegeven.