// ----------------------------------------------------------
// 📦 Importy
// ----------------------------------------------------------
import React from "react";                   // React musí být importován, aby komponenta mohla fungovat
import { View, TouchableOpacity, Text } from "react-native"; // View = kontejner, TouchableOpacity = klikací tlačítko, Text = text
import { Picker } from "@react-native-picker/picker";
import styles from "../styles/appStyles";   // Importujeme externí styly
import useStopwatchState from "../hooks/useStopwatchState";

// ----------------------------------------------------------
// 🧩 Komponenta: StopwatchButtons
// Props:
// - running (boolean) → zda stopky právě běží
// - start (function) → spustí stopky
// - pause (function) → pozastaví stopky
// - endAndReset (function) → uloží a resetuje stopky
// ----------------------------------------------------------
export default function StopwatchButtons({
    running, start, pause, endAndReset,
    categories, selectedCategory, setSelectedCategory,
    selectedTask, setSelectedTask
}) {


    return (
        // Hlavní kontejner tlačítek
        <View style={styles.controls}>
            {/* Výběr kategorie */}
            {categories.length === 0 ? (
                <Text>Načítání kategorií…</Text>
            ) : (
                <> <Picker
                    style={styles.picker}
                    darkTheme={true}
                    selectedValue={selectedCategory}
                    onValueChange={v => {
                        setSelectedCategory(v);
                        setSelectedTask(""); // reset podkategorie při změně hlavní kategorie
                    }}
                >
                    {(categories || []).map(cat => (
                        <Picker.Item key={cat.name} label={cat.name} value={cat.name} />
                    ))}
                </Picker>

                    <Text>Podkategorie:</Text>
                    <Picker
                        style={styles.picker}
                        darkTheme={true}

                        selectedValue={selectedTask}
                        onValueChange={v => setSelectedTask(v)}
                    >
                        {(
                            (categories || []).find(cat => cat.name === selectedCategory)?.subcategories
                            || []
                        ).map(sub => (
                            <Picker.Item key={sub} label={sub} value={sub} />
                        ))}
                    </Picker>
                </>
            )}

            {/* 
                Start / Pause button
                - pokud `running` je true → tlačítko spouští pause
                - pokud `running` je false → tlačítko spouští start
            */}
            <TouchableOpacity
                style={styles.button}
                onPress={running ? pause : start}  // vybere správnou funkci podle stavu
            >
                {/* Text tlačítka */}
                <Text style={styles.btnText}>
                    {running ? "Pause" : "Start" /* dynamický text */}
                </Text>
            </TouchableOpacity>

            {/* 
                Reset button
                - vždy volá endAndReset (ukládá do historie a vynuluje stopky)
            */}
            <TouchableOpacity
                style={[styles.button, styles.resetButton]}  // kombinace základního a červeného stylu
                onPress={endAndReset}                        // volání funkce
            >
                <Text style={styles.btnText}>
                    Reset (save)
                </Text>
            </TouchableOpacity>

        </View>
    );
}



/* --------------------------------------------------------------
   ✔️ TypeScript verze props:

   interface Props {
       running: boolean;
       start: () => void;
       pause: () => void;
       endAndReset: () => void;
   }

   export default function StopwatchButtons({ running, start, pause, endAndReset }: Props) { ... }

   -------------------------------------------------------------- */
