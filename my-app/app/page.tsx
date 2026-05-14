"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  findShortestRouteByPlaceIds,
  getAllPlaces,
  getMarkedPlaces,
} from "./backend/utils/routeFinder";

const allPlaces = getAllPlaces();
const placeById = new Map(allPlaces.map((place) => [place.id, place]));
const destinationCandidates = getMarkedPlaces();

export default function Home() {
  const searchParams = useSearchParams();
  const [destinationId, setDestinationId] = useState("");

  const currentLocationId =
    searchParams.get("id") ?? searchParams.get("currentLocation") ?? "";
  const currentPlace = currentLocationId ? placeById.get(currentLocationId) : undefined;

  const availableDestinations = destinationCandidates.filter(
    (place) => place.id !== currentLocationId
  );

  const routeResult = useMemo(() => {
    if (!currentLocationId || !destinationId) {
      return null;
    }
    return findShortestRouteByPlaceIds(currentLocationId, destinationId);
  }, [currentLocationId, destinationId]);

  const canSearch = Boolean(currentPlace && destinationId);

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900 p-6 md:p-10">
      <section className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-semibold">Nawigacja po piętrze</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Current location jest pobierane z linku po <code>id</code> (np.{" "}
          <code>?id=reception</code>) lub po <code>currentLocation</code>.
        </p>

        <div className="mt-6 space-y-2 rounded-lg border border-zinc-200 p-4">
          <p className="text-sm font-medium">Aktualna lokalizacja (z URL):</p>
          {currentLocationId ? (
            currentPlace ? (
              <p className="text-sm">
                <strong>{currentPlace.label}</strong>{" "}
                <span className="text-zinc-500">({currentPlace.id})</span>
              </p>
            ) : (
              <p className="text-sm text-red-600">
                Nie znaleziono miejsca o id: <code>{currentLocationId}</code>
              </p>
            )
          ) : (
            <p className="text-sm text-amber-700">
              Brak parametru w URL. Dodaj <code>?id=...</code>.
            </p>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <label htmlFor="destination" className="text-sm font-medium">
            Wybierz miejsce docelowe
          </label>
          <select
            id="destination"
            className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-sm"
            value={destinationId}
            onChange={(event) => setDestinationId(event.target.value)}
          >
            <option value="">-- wybierz --</option>
            {availableDestinations.map((place) => (
              <option key={place.id} value={place.id}>
                {place.label} ({place.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 p-4">
          {!canSearch ? (
            <p className="text-sm text-zinc-600">
              Ustaw poprawne <code>id</code> w linku i wybierz cel z listy.
            </p>
          ) : routeResult && routeResult.found ? (
            <div className="space-y-3">
              <p className="text-sm">
                Najkrótsza trasa: <strong>{routeResult.from.label}</strong> →{" "}
                <strong>{routeResult.to.label}</strong>
              </p>
              <p className="text-sm text-zinc-700">
                Dystans: <strong>{routeResult.distance.toFixed(2)}</strong>
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {routeResult.path.map((place) => (
                  <li key={place.id}>
                    {place.label} <span className="text-zinc-500">({place.id})</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="text-sm text-red-600">
              Nie udało się wyznaczyć trasy dla podanych punktów.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
