// ----------------------------------------------------------
// 📦 Importy
// ----------------------------------------------------------
import React from "react";
import { FlatList, View, Text } from "react-native";
import styles from "../styles/appStyles";

// ----------------------------------------------------------
// 🧩 Komponenta: HistoryList
// Přijímá jediný prop: `history` = pole uložených záznamů.
// Každý záznam obsahuje start, end a duration.
// ----------------------------------------------------------
export default function HistoryList({ history }) {

    // ----------------------------------------------------------
    // ⏱ Pomocná funkce: formátování ms → HH:MM:SS
    // ----------------------------------------------------------
    const formatDuration = (ms) => {
        if (!ms) return "--";
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    // ----------------------------------------------------------
    // 🖼 Render komponenty
    // ----------------------------------------------------------
    return (
        <FlatList
            // Styl kontejneru se seznamem
            style={styles.historyContainer}

            // Data: pole záznamů (start, end, duration…)
            data={history}

            // keyExtractor — FlatList potřebuje unikátní ID pro každý řádek
            keyExtractor={item => item.id}

            // renderItem — říká, jak má vypadat každý řádek v seznamu
            renderItem={({ item }) => (
                <View style={styles.row}>
                    
                    <Text>Task: {item.taskName} {item.category ? `(${item.category})` : ""}</Text>
                    {/* datum a čas začátku záznamu */}
                    <Text>Start: {item.start.toLocaleTimeString()}</Text>

                    {/* datum a čas konce záznamu – pokud byla pauza, vezmeme endTime */}
                    <Text>End: {item.end.toLocaleTimeString()}</Text>

                    {/* trvání formátujeme pomocí pomocné funkce */}
                    <Text>Dur: {formatDuration(item.durationMs)}</Text>
                </View>
            )}
        />
    );
}

/* --------------------------------------------------------------
   🔹 TypeScript verze props by vypadala takto:

   type HistoryItem = {
     id: string;
     start: Date;
     end: Date;        // přesně odpovídá endTime z hooku
     durationMs: number;
   };

   interface Props {
     history: HistoryItem[];
   }

   export default function HistoryList({ history }: Props) { ... }
-------------------------------------------------------------- */
