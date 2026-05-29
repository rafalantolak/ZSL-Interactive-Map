"use client";

import { useEffect, useRef, useState } from "react";
// Pamiętaj o poprawnej ścieżce
import schoolMapImg from "../public/school-plan-full.png";
import { getAllPlaces, findShortestRouteByPlaceIds, RouteResult } from "./backend/utils/routeFinder";

export default function NavigationMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mapDimensions = {
    width: 842,
    height: 1191,
  };

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [places, setPlaces] = useState(getAllPlaces());
  const [startPlaceId, setStartPlaceId] = useState<string>("");
  const [endPlaceId, setEndPlaceId] = useState<string>("");
  const [route, setRoute] = useState<RouteResult | null>(null);
  
  // Stan do animowania kroków "po kolei"
  const [step, setStep] = useState(0);

  // Ładowanie obrazka
  useEffect(() => {
    const img = new Image();
    img.src = schoolMapImg.src;
    img.onload = () => setBgImage(img);
  }, []);

  // Obliczanie trasy
  useEffect(() => {
    if (startPlaceId && endPlaceId) {
      const result = findShortestRouteByPlaceIds(startPlaceId, endPlaceId);
      setRoute(result);
    } else {
      setRoute(null);
    }
  }, [startPlaceId, endPlaceId]);

  // Animacja - "po kolei" zwiększamy ilość widocznych punktów
  useEffect(() => {
    if (route && route.found) {
      setStep(1); // Zaczynamy od pierwszego punktu
      const interval = setInterval(() => {
        setStep((prev) => {
          if (prev < route.path.length) return prev + 1;
          clearInterval(interval); // Koniec trasy
          return prev;
        });
      }, 150); // Szybkość pokazywania punktów (150ms)
      
      return () => clearInterval(interval);
    } else {
      setStep(0);
    }
  }, [route]);

  // Silnik rysujący na Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Czyścimy ekran i rysujemy mapę
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    if (route && route.found && step > 0) {
      const pathToDraw = route.path.slice(0, step);

      // --- 1. RYSOWANIE LINII ŁĄCZĄCYCH PUNKTY ---
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < pathToDraw.length; i++) {
        const current = pathToDraw[i];
        const prev = i > 0 ? pathToDraw[i - 1] : null;

        if (i === 0) {
          ctx.moveTo(current.node.posX, current.node.posY);
        } else if (prev) {
          // Jeśli następuje zmiana piętra (schody), zmieniamy styl linii
          if (current.floorId !== prev.floorId) {
            ctx.stroke(); // Zakończ zwykłą linię
            
            ctx.beginPath();
            ctx.setLineDash([5, 10]); // Linia przerywana
            ctx.strokeStyle = "rgba(168, 85, 247, 0.8)"; // Fioletowa dla pięter
            ctx.moveTo(prev.node.posX, prev.node.posY);
            ctx.lineTo(current.node.posX, current.node.posY);
            ctx.stroke();
            
            ctx.beginPath(); // Przywróć normalną linię dla bieżącego piętra
            ctx.setLineDash([]);
            ctx.strokeStyle = "#3b82f6"; // Niebieska
            ctx.moveTo(current.node.posX, current.node.posY);
          } else {
            ctx.strokeStyle = "#3b82f6";
            ctx.lineTo(current.node.posX, current.node.posY);
          }
        }
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dla pewności

      // --- 2. RYSOWANIE KAŻDEGO WĘZŁA "PO KOLEI" ---
      pathToDraw.forEach((place, index) => {
        const { posX, posY } = place.node;
        
        let radius = 7;
        let fillColor = "#f59e0b"; // Pomarańczowy dla punktów pośrednich
        
        if (index === 0) {
          fillColor = "#10b981"; // Zielony Start
          radius = 11;
        } else if (index === route.path.length - 1 && step === route.path.length) {
          fillColor = "#ef4444"; // Czerwony Koniec
          radius = 11;
        } else if (place.kind === "stairs") {
          fillColor = "#a855f7"; // Fioletowe punkty dla węzłów schodów
          radius = 8;
        }

        // Rysujemy kółko punktu
        ctx.beginPath();
        ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dodajemy numerek kroku wewnątrz punktu
        ctx.fillStyle = (index === 0 || index === route.path.length - 1) ? "#ffffff" : "#000000";
        ctx.font = "bold 9px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((index + 1).toString(), posX, posY);
      });
    }
  }, [bgImage, route, step]); // Reagujemy na każdy 'step' animacji

  const selectablePlaces = places
    .filter((p) => p.kind === "room" || p.kind === "entrance" || p.kind === "exit")
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <main className="flex-1 bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex-1 w-full">
          <label className="block text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Start</label>
          <select
            className="w-full bg-gray-950 border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-blue-500 transition-colors"
            value={startPlaceId}
            onChange={(e) => setStartPlaceId(e.target.value)}
          >
            <option value="">-- Wybierz punkt początkowy --</option>
            {selectablePlaces.map((place) => (
              <option key={place.id} value={place.id}>
                {place.label} ({place.floorId})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Cel</label>
          <select
            className="w-full bg-gray-950 border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-red-500 transition-colors"
            value={endPlaceId}
            onChange={(e) => setEndPlaceId(e.target.value)}
          >
            <option value="">-- Wybierz punkt końcowy --</option>
            {selectablePlaces.map((place) => (
              <option key={place.id} value={place.id}>
                {place.label} ({place.floorId})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto text-center md:text-right mt-4 md:mt-0 flex flex-col justify-center">
          {route ? (
            route.found ? (
              <>
                <span className="text-sm text-gray-400">Dystans:</span>
                <span className="text-2xl font-bold text-emerald-400">{Math.round(route.distance)} px</span>
              </>
            ) : (
              <span className="text-red-400 font-bold">Brak trasy!</span>
            )
          ) : (
            <span className="text-gray-500 italic">Wybierz punkty</span>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl border-4 border-gray-800 rounded-xl overflow-hidden bg-white shadow-2xl relative">
        <canvas
          ref={canvasRef}
          width={mapDimensions.width}
          height={mapDimensions.height}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </main>
  );
}