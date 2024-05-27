# Meeting-Scheduler Backend

## Instrukcje do uruchomienia aplikacji

### Pobranie projektu

Skopiuj adres URL repozytorium GitHub i wykonaj polecenie w terminalu:

```bash
git clone https://github.com/Dyspersja/Meeting-Scheduler.git
```
Lub pobierz repozytorium poprzez przeglądarkę.

### Konfiguracja plików zasobów

1. Przejdź do folderu z pobranym projektem.
2. Otwórz folder `resources`.
3. Znajdź plik konfiguracyjny `application.properties`.
4. Zmień wartości pól `spring.datasource.url`, `spring.datasource.username` i `spring.datasource.password` na odpowiednie wartości dla Twojej lokalnej konfiguracji bazy danych.
5. Następnie przejdź do `#JWT` gdzie ustawisz swój unikalny `secretKey` do zapewnienia bezpieczeństwa dla aplikacji wraz z czasami odpowiedzialnymi za długość ważności tokenu. Przykładowa komenda dzięki której wygenerujesz secret-key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
6. W tym samym pliku pod `#EmailSender` ustaw swój mail w polu `spring.mail.username` i wygeneruj haslo, które umieścisz w `spring.mail.password`, nie zapomnij o skonfigurowaniu hosta i portu.

### Utworzenie bazy danych

Przed uruchomieniem aplikacji z IDE, upewnij się, że utworzyłeś bazę danych o nazwie którą podałeś w `spring.datasource.url`.
```bash
CREATE DATABASE meeting_scheduler
```


### Uruchomienie aplikacji poprzez Docker

Upewnij się, że masz zainstalowaną platformę Docker na swoim komputerze.

1. Skonfiguruj plik properties który znajduje się w `Backend\src\main\resources\application.properties`.
2. Otwórz terminal i przejdź do katalogu z pobranym projektem.
3. Uruchom docker-compose, poprzez wpisanie:


```bash
docker-compose up
```
3. Twoja aplikacja backendowa będzie dostępna pod adresem `http://localhost:8080`.
