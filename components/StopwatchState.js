// StopwatchState.js
// Tento soubor obsahuje logiku stopek jako samostatný "hook".
// Hook = speciální funkce, která pracuje se stavem (state).
// React je knihovna pro stavbu uživatelského rozhraní.
// useState = ukládání hodnot, které se mění (čas, zda běží stopky...)
// useRef = ukládání hodnot, které se NEMĚNÍ re-renderem (ID timeru, počáteční čas)
import React, { useRef, useState } from 'react';

import { useState, useRef, useEffect } from "react";

export default function useStopwatchState() {
    // -------------------------------
    // 1) Reálný čas startu (nezmizí po pauze)
    // -------------------------------
    const [startTime, setStartTime] = useState(null);

    // -------------------------------
    // 2) Zda stopky běží nebo jsou pauznuté
    // -------------------------------
    const [isRunning, setIsRunning] = useState(false);

    // -------------------------------
    // 3) Aktuální zobrazený čas (počítadlo)
    // -------------------------------
    const [elapsedMs, setElapsedMs] = useState(0);

    // -------------------------------
    // 4) Časovač (interval), aby šel zastavit
    // -------------------------------
    const intervalRef = useRef(null);

    // -------------------------------
    // 5) Seznam uložené historie
    // -------------------------------
    const [history, setHistory] = useState([]);

    // =======================================
    // START nebo PAUSE
    // =======================================
    function toggleStartPause() {
        if (isRunning) {
            // Pokud běží → dáme pauzu
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            return;
        }

        // Pokud je pauza → start nebo pokračování
        const now = new Date();

        // Pokud startTime není nastavený → nový start
        if (!startTime) {
            setStartTime(now);
        }

        // Spustíme interval 10× za vteřinu
        intervalRef.current = setInterval(() => {
            setElapsedMs(Date.now() - startTime.getTime());
        }, 100);

        setIsRunning(true);
    }

    // =======================================
    // RESET = uloží historii + vynuluje vše
    // =======================================
    function reset() {
        clearInterval(intervalRef.current);

        if (startTime) {
            const end = new Date();
            const duration = end - startTime;

            setHistory(prev => [
                {
                    id: crypto.randomUUID(),
                    start: startTime,
                    end,
                    durationMs: duration
                },
                ...prev
            ]);
        }

        setStartTime(null);
        setElapsedMs(0);
        setIsRunning(false);
    }

    // Uklidíme interval při odchodu
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return {
        startTime,
        isRunning,
        elapsedMs,
        history,
        toggleStartPause,
        reset
    };
}