# Raamatuhaldussüsteem

Täisvirnaga raamatuhaldussüsteem, mis pakub raamatute haldamiseks toiminguid CRUD (Create, Read, Update, Delete). See rakendus on loodud Node.js-i, Express.js-i ja MySQL-i koos Sequelize ORM-iga.

## Omadused

- Looge, lugege, värskendage ja kustutage raamatuid
- RESTful API lõpp-punktid
- MySQL andmebaasi integreerimine Sequelise ORM-iga
- Swagger API dokumentatsioon
- CORS on lubatud erinevate päritolupäringute jaoks
- Keskkonna muutuv konfiguratsioon

## Eeltingimused

Enne selle rakenduse käivitamist veenduge, et olete installinud järgmise:
- Node.js (v12 või uuem)
- MySQL server
- npm (sõlme paketihaldur)

## Arenduskeskkona seadistamine

Avame VS Code ja kirjutame:
- git clone "projekti-repositoorium"
- cd "projekti-kaust"
- npm install

Looge ja seadistage MySQL andmebaas:
- CREATE DATABASE bookdb;

## Rakenduse käivitamine

Rakenduse käivitamiseks avame "New Terminal" ja kirjutame: npm start
