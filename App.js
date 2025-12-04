import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppScreen from "./AppScreen"; // stopky
import CategoriesScreen from "./components/CategoriesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Stopwatch" component={AppScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
