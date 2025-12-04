import { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Klíč pro ukládání historie do AsyncStorage
const STORAGE_KEY = "@stopwatch_history";
const STORAGE_KEY_CATEGORIES = "@stopwatch_categories";

export default function useStopwatchState() {
  // -----------------------------------------------------------
  // Stavové proměnné
  // -----------------------------------------------------------

  // startTime: kdy byly stopky poprvé spuštěny
  const [startTime, setStartTime] = useState(null); // TS: Date | null

  // endTime: čas poslední pauzy / zastavení
  const [endTime, setEndTime] = useState(null); // TS: Date | null

  // elapsedMs: kolik milisekund už bylo změřeno
  const [elapsedMs, setElapsedMs] = useState(0); // TS: number

  // running: logická hodnota, zda interval běží
  const [running, setRunning] = useState(false); // TS: boolean

  // historie měření
  const [history, setHistory] = useState([]); // TS: HistoryItem[]

  const [categories, setCategories] = useState([]);       // seznam kategorií
  const [selectedCategory, setSelectedCategory] = useState(""); // vybraná kategorie
  const [selectedTask, setSelectedTask] = useState("");        // vybraná podkategorie


  // intervalRef: uchovává ID intervalu – změna .current nezpůsobuje re-render
  const intervalRef = useRef(null);

  // baseRef: timestamp začátku měření, při pauze korigujeme
  const baseRef = useRef(0);

  // -----------------------------------------------------------
  // Načtení historie z AsyncStorage při mountu komponenty
  // -----------------------------------------------------------
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          // Převedeme string na objekt + zpět na Date
          const parsed = JSON.parse(saved).map(item => ({
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
          }));
          setHistory(parsed);
        }
      } catch (e) {
        console.log("Chyba při načítání historie:", e);
      }
    };
    loadHistory();
  }, []);

  // načtení kategorií při mountu
  const loadCategories = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCategories(parsed);
        if (parsed.length > 0) setSelectedCategory(parsed[0].name);
      }
    } catch (e) {
      console.log("Chyba při načítání kategorií:", e);
    }
  };

  // zavoláme ji při mountu
  useEffect(() => {
    loadCategories();
  }, []);

  // -----------------------------------------------------------
  // Funkce pro uložení historie do AsyncStorage
  // -----------------------------------------------------------
  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.log("Chyba při ukládání historie:", e);
    }
  };

  // -----------------------------------------------------------
  // START / RESUME
  // -----------------------------------------------------------
  function start() {
    if (running) return; // pokud už běží, nic nedělat

    if (!startTime) {
      const now = new Date();
      setStartTime(now);
      baseRef.current = Date.now();
    } else {
      // pokračujeme po pauze → odečteme už změřené ms
      baseRef.current = Date.now() - elapsedMs;
    }

    // Interval aktualizuje elapsedMs každých 250ms
    intervalRef.current = setInterval(() => {
      const startBase = baseRef.current || Date.now();
      setElapsedMs(Date.now() - startBase);
    }, 250);

    setRunning(true);
    setEndTime(null); // startujeme → předchozí endTime již není relevantní
  }

  // -----------------------------------------------------------
  // PAUSE
  // -----------------------------------------------------------
  function pause() {
    if (!running) return;

    // zastavíme interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (startTime) {
      const currentElapsed = Date.now() - (baseRef.current || Date.now());
      setElapsedMs(currentElapsed);

      // aktualizujeme endTime při pauze
      setEndTime(new Date());
    }

    setRunning(false);
  }

  // -----------------------------------------------------------
  // END + RESET
  // -----------------------------------------------------------
  function endAndReset(taskName = "Nezařazeno", category = "") {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (startTime) {
      const end = new Date();
      const finalElapsed = elapsedMs || (Date.now() - (baseRef.current || Date.now()));

      // nový záznam historie
      const record = {
        id: Math.random().toString(36).slice(2),
        start: startTime,
        end: endTime || end, // pokud jsme nikdy nepauzovali, použijeme aktuální čas
        durationMs: finalElapsed,
        taskName: selectedTask || "Nezařazeno",
        category: selectedCategory || "",
      };

      // Aktualizujeme historii a zároveň persistujeme
      setHistory(prev => {
        const updated = [record, ...prev]; // nový seznam historie
        saveHistory(updated);              // uložíme persistentně
        return updated;                     // aktualizujeme stav
      });

    }

    // reset stavu stopek
    setStartTime(null);
    setEndTime(null);
    setElapsedMs(0);
    baseRef.current = 0;
    setRunning(false);
  }

  // -----------------------------------------------------------
  // CLEANUP – při unmount komponenty zastavíme interval
  // -----------------------------------------------------------
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // -----------------------------------------------------------
  // RETURN: stav + akce
  // -----------------------------------------------------------
  return {
    startTime,
    endTime,
    elapsedMs,
    running,
    history,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedTask,
    setSelectedTask,
    start,
    pause,
    endAndReset,
    loadCategories,
  };
}

/* --------------------------------------------------------------
  🔹 TypeScript návrh pro historii
  type HistoryItem = {
    id: string;
    start: Date;
    end: Date;
    durationMs: number;
    taskName: string;
    category: string;
  };

  interface Props {
    history: HistoryItem[];
  }
-------------------------------------------------------------- */
