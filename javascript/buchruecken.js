function adjustInputWidth(input) {
  // Berechnet die Breite dynamisch: Anzahl der Zeichen * Faktor + Basis-Padding
  // Da die Schrift nun größer ist (ca. 48px), wurden die Faktoren angepasst
  const length = input.value.length || 1;
  input.style.width = (length * 34 + 30) + 'px';
}

function berechne() {
  // Input-Werte auslesen
  const seitenanzahlInput = document.getElementById('seitenanzahl');
  const papiergewichtInput = document.getElementById('papiergewicht');
  const papiervolumenInput = document.getElementById('papiervolumen');

  // Dynamische Breite bei der Berechnung anpassen
  adjustInputWidth(seitenanzahlInput);
  adjustInputWidth(papiergewichtInput);
  adjustInputWidth(papiervolumenInput);

  const seitenanzahl = parseFloat(seitenanzahlInput.value) || 0;
  const papiergewicht = parseFloat(papiergewichtInput.value) || 0;
  const papiervolumen = parseFloat(papiervolumenInput.value) || 0;

  // Formel: (Seitenanzahl ÷ 2) × ((Papiergewicht ÷ 1000) × Papiervolumen) + 1,5
  const umschlagkarton = 1.5; // mm
  const staerke = (seitenanzahl / 2) * ((papiergewicht / 1000) * papiervolumen) + umschlagkarton;

  // Ergebnis anzeigen
  document.getElementById('resultat').textContent = staerke.toFixed(2) + 'mm';

  // Isometrische Buchdicke berechnen (in SVG-Koordinaten)
  const thickness = Math.min(Math.max(staerke * 2.5, 8), 80);

  // Basis-Positionen (Standardbuch)
  const frontLeftX = 80;
  const frontLeftY = 120;
  const frontBottomY = 220;
  const frontRightX = 200;
  const topLeftX = 120;
  const topLeftY = 60;
  const standardTopRightX = 240;
  const standardRightBottomExtraY = 160;

  // Mit Buchdicke verschiebene Positionen
  const topRightX = standardTopRightX + thickness * 0.35;
  const topRightY = topLeftY + thickness * 0.15;
  const rightBottomX = frontRightX + thickness;
  const rightBottomY = frontBottomY;
  const rightTopExtraY = standardRightBottomExtraY + thickness * 0.4;

  // Vorderseite
  const bookFront = document.getElementById('book-front');
  if (bookFront) {
    const frontPolygon = `${frontLeftX},${frontLeftY} ${frontLeftX},${frontBottomY} ${frontRightX},${frontBottomY} ${frontRightX},${frontLeftY}`;
    bookFront.setAttribute('points', frontPolygon);
  }

  // Obere Seite
  const bookTop = document.getElementById('book-top');
  if (bookTop) {
    const topPolygon = `${frontLeftX},${frontLeftY} ${topLeftX},${topLeftY} ${topRightX},${topRightY} ${frontRightX},${frontLeftY}`;
    bookTop.setAttribute('points', topPolygon);
  }

  // Rechte Seite
  const bookRight = document.getElementById('book-right');
  if (bookRight) {
    const rightPolygon = `${frontRightX},${frontLeftY} ${topRightX},${topRightY} ${rightBottomX},${rightBottomY - rightTopExtraY} ${rightBottomX},${rightBottomY}`;
    bookRight.setAttribute('points', rightPolygon);
  }

  // Verbindungslinie oben rechts
  const spineTopLine = document.getElementById('spine-top-line');
  if (spineTopLine) {
    spineTopLine.setAttribute('x1', topRightX);
    spineTopLine.setAttribute('y1', topRightY);
    spineTopLine.setAttribute('x2', rightBottomX);
    spineTopLine.setAttribute('y2', rightBottomY - rightTopExtraY);
  }
}

// Live-Berechnung bei jedem Input
document.addEventListener('DOMContentLoaded', function () {
  const inputs = ['seitenanzahl', 'papiergewicht', 'papiervolumen'];

  inputs.forEach(id => {
    const inputEl = document.getElementById(id);
    if (inputEl) {
      // Event-Listener für Eingaben
      inputEl.addEventListener('input', berechne);
      // Text automatisch auswählen bei Fokus (erleichtert die Tastaturbedienung)
      inputEl.addEventListener('focus', function () {
        inputEl.select();
      });
      // Initiale Breite beim Laden der Seite setzen
      adjustInputWidth(inputEl);
    }
  });

  // Initiale Berechnung ausführen
  berechne();

  // Funktion zum Kopieren in die Zwischenablage
  function copyToClipboard() {
    const resultatEl = document.getElementById('resultat');
    if (!resultatEl || resultatEl.textContent === 'Kopiert!') return;

    const textToCopy = resultatEl.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Kurzes visuelles Feedback (Farbe wechseln, Text "Kopiert!" anzeigen)
      resultatEl.style.color = '#ff0059';
      const originalText = textToCopy;
      resultatEl.textContent = 'Kopiert!';
      setTimeout(() => {
        resultatEl.style.color = '';
        resultatEl.textContent = originalText;
      }, 800);
    }).catch(err => {
      console.error('Fehler beim Kopieren in die Zwischenablage:', err);
    });
  }

  // Zwischenablage kopieren bei Klick auf das Ergebnis
  const resultatEl = document.getElementById('resultat');
  if (resultatEl) {
    resultatEl.addEventListener('click', copyToClipboard);
  }

  // Tastaturkürzel 'c' zum Kopieren
  document.addEventListener('keydown', function (e) {
    if (e.key === 'c' || e.key === 'C') {
      // CMD+C / CTRL+C Standardverhalten nicht unterbrechen
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      copyToClipboard();
    }
  });

  // Fokus-Loop für die drei Eingabefelder (verhindert das Abwandern in die Browser-Bedienelemente)
  const seitenanzahlEl = document.getElementById('seitenanzahl');
  const papiergewichtEl = document.getElementById('papiergewicht');
  const papiervolumenEl = document.getElementById('papiervolumen');

  if (seitenanzahlEl && papiergewichtEl && papiervolumenEl) {
    papiervolumenEl.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        seitenanzahlEl.focus();
      }
    });

    seitenanzahlEl.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        papiervolumenEl.focus();
      }
    });
  }

  // Zurück zur Hauptseite mit Escape-Taste (keyup wird in Firefox nicht blockiert)
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      window.location.href = 'index.html';
    }
  });
});