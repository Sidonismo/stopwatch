import React, { useCallback } from "react";
import { View, Button } from "react-native";
import TimerDisplay from "./components/TimerDisplay";
import StopwatchButtons from "./components/StopwatchButtons";
import HistoryList from "./components/HistoryList";
import useStopwatchState from "./hooks/useStopwatchState";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./styles/appStyles";

export default function AppScreen({ navigation }) {
    const {
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
        loadCategories
    } = useStopwatchState();

    // Když se AppScreen dostane do popředí → znovu načti kategorie
    useFocusEffect(
        useCallback(() => {
            loadCategories();
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* Tlačítko pro navigaci na CategoriesScreen */}
            <Button
                title="Správa kategorií"
                onPress={() => navigation.navigate("Categories")}
            />

            <TimerDisplay startTime={startTime} elapsedMs={elapsedMs} />
            <StopwatchButtons
                running={running}
                start={start}
                pause={pause}
                endAndReset={endAndReset}

                categories={categories}                 // ✅
                selectedCategory={selectedCategory}     // ✅
                setSelectedCategory={setSelectedCategory} // ✅
                selectedTask={selectedTask}             // ✅
                setSelectedTask={setSelectedTask}       // ✅
            />
            <HistoryList history={history} />
        </View>
    );
}
