# Budapest-Déli Railway Station - Quality Audit App

Interaktywna aplikacja do przeprowadzania audytu jakości i komfortu stacji kolejowej Budapest-Déli. Aplikacja oparta jest na nowoczesnych technologiach takich jak **React**, **Vite**, **TypeScript**, **Leaflet** (interaktywne mapy) oraz **Tailwind CSS**.

Aplikacja umożliwia:
* Wprowadzenie własnego podpisu (nickname) przed rozpoczęciem audytu.
* Interaktywne ocenianie różnych stref stacji bezpośrednio na mapie.
* Wyświetlanie zaawansowanych statystyk (m.in. wskaźnika wydajności stacji) w czasie rzeczywistym.
* Przeglądanie odpowiedzi innych audytorów (podsumowanie społecznościowe).
* Eksporowanie wyników (zarówno własnego pojedynczego audytu, jak i wszystkich dotychczasowych audytów zgromadzonych w pamięci lokalnej) do arkusza kalkulacyjnego **CSV / Excel**.

---

## 📋 Wymagania systemowe
Przed uruchomieniem aplikacji upewnij się, że na Twoim komputerze zainstalowane są następujące narzędzia:
1. **Node.js** – zalecana najnowsza wersja LTS (wersja 18 lub nowsza).
   * Możesz pobrać z oficjalnej strony: [nodejs.org](https://nodejs.org/)
2. **Narzędzie do zarządzania pakietami** (jest instalowane automatycznie razem z Node.js):
   * **npm** (zalecany) lub alternatywnie **yarn / pnpm**.

---

## 🚀 Instrukcja uruchomienia projektu (Krok po Kroku)

Postępuj zgodnie z poniższymi instrukcjami, aby uruchomić aplikację lokalnie na swoim komputerze:

### Krok 1: Przygotuj pliki projektu
Rozpakuj otrzymane archiwum ZIP z kodem źródłowym projektu do wybranego folderu na swoim dysku (np. na Pulpicie).

### Krok 2: Otwórz terminal (konsolę) w folderze projektu
Musisz przejść do katalogu głównego projektu w terminalu:
* **Windows**: Wejdź do folderu z projektem, przytrzymaj klawisz `Shift`, kliknij prawym przyciskiem myszy w pustym miejscu wewnątrz folderu i wybierz **„Otwórz okno programu PowerShell tutaj”** lub **„Otwórz terminal”**.
* **macOS / Linux**: Otwórz aplikację *Terminal* i przeciągnij folder projektu do okna terminala, wpisując wcześniej polecenie `cd ` (np. `cd /sciezka/do/folderu/projektu`).

### Krok 3: Zainstaluj niezbędne zależności (biblioteki)
W terminalu wpisz poniższe polecenie i naciśnij **Enter**:
```bash
npm install
```
*To polecenie pobierze i zainstaluje wszystkie pakiety zdefiniowane w pliku `package.json` (w tym React, Vite, Leaflet, Tailwind CSS i biblioteki ikon) do nowo utworzonego katalogu `node_modules`.*

### Krok 4: Uruchom lokalny serwer deweloperski
Po pomyślnej instalacji pakietów, wpisz w konsoli:
```bash
npm run dev
```
Po chwili konsola wyświetli informację o uruchomieniu serwera, na przykład:
```
  VITE v6.2.3  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.50:3000/
```

### Krok 5: Otwórz aplikację w przeglądarce internetowej
Otwórz swoją ulubioną przeglądarkę internetową (Chrome, Edge, Firefox lub Safari) i przejdź pod adres:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Przydatne skrypty w projekcie

W folderze aplikacji możesz uruchomiać również inne skrypty zdefiniowane w pliku konfiguracji:

* `npm run build` – Przygotowuje zoptymalizowaną wersję produkcyjną aplikacji, która zostanie zapisana w nowym folderze `dist`. Te pliki są gotowe do wrzucenia na dowolny darmowy hosting (Static Site Hosting).
* `npm run preview` – Umożliwia lokalny podgląd zbudowanej wcześniej wersji produkcyjnej projektu (wymaga uprzedniego uruchomienia `npm run build`).
* `npm run lint` – Sprawdza poprawność kodu i typowania TypeScript.

---

## 📦 Informacje o przechowywaniu danych
Zapisy audytów i lista wszystkich uczestników są przechowywane lokalnie przy użyciu przeglądarkowego mechanizmu **LocalStorage**. Dane nie są wysyłane na żaden zewnętrzny serwer chmurowy — oznacza to, że są w 100% bezpieczne, dopóki nie wyczyścisz danych lub ciasteczek w przeglądarce internetowej. Wyeksportowany plik CSV można łatwo otworzyć w Microsoft Excel, Google Sheets, LibreOffice Calc lub dowolnym edytorze tekstowym.
# survey_deli_station
