import React from "react";
// View = kontejnerový element
// Text = textový element
import { View, Text } from "react-native";

// Import sdílených stylů pro celou aplikaci
import styles from "../styles/appStyles";

// Komponenta přijímá 2 props:
// - startTime: Date nebo null (čas, kdy měření začalo)
// - elapsedMs: počet milisekund naměřených stopek
// TS varianta props by vypadala např.:
// interface Props { startTime: Date | null; elapsedMs: number; }
// export default function TimerDisplay({ startTime, elapsedMs }: Props) {
export default function TimerDisplay({ startTime, elapsedMs }) {

    // ----------------------------------------------------------
    // ❤️ Funkce na formátování času (z milisekund → HH:MM:SS)
    // ----------------------------------------------------------
    // Přijme milisekundy a převede je na text "HH:MM:SS".
    // Vrací dvojité pomlčky, pokud není validní vstup.
    //
    // TS varianta:
    // const formatDuration = (ms: number | null): string => { ... }
    const formatDuration = (ms) => {
        // Pokud není ms nebo je 0, vracíme placeholder
        if (!ms) return "--";

        // Celkový počet sekund
        const totalSec = Math.floor(ms / 1000);

        // Počet hodin
        const h = Math.floor(totalSec / 3600);

        // Minuty = zbytek po odečtení hodin
        const m = Math.floor((totalSec % 3600) / 60);

        // Sekundy = zbytek po odečtení minut
        const s = totalSec % 60;

        // Vrátíme formátovaný čas HH:MM:SS s doplněním nul
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
        // Kontejner pro celý timer (v appStyles musí existovat styl timerBox)
        <View style={styles.timerBox}>

            {/* Zobrazení sekund "nahrubo" – vhodné pro vizuální odpočet */}
            <Text style={styles.timer}>
                {Math.floor((elapsedMs || 0) / 1000)}s
            </Text>

            {/* Zobrazení startovacího času, pokud existuje */}
            <Text>
                Start: {startTime ? startTime.toLocaleTimeString() : "--"}
            </Text>

            {/* Zobrazení formátované celkové doby běhu */}
            <Text>
                Elapsed: {formatDuration(elapsedMs)}
            </Text>
        </View>
    );
}
