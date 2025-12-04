// ----------------------------------------------------------
// 📦 Importy
// ----------------------------------------------------------
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/appStyles";

// ----------------------------------------------------------
// 🔑 Klíč pro AsyncStorage
// ----------------------------------------------------------
const STORAGE_KEY_CATEGORIES = "@stopwatch_categories";

// ----------------------------------------------------------
// 🧩 Komponenta: CategoriesScreen
// ----------------------------------------------------------
export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ----------------------------------------------------------
  // načtení kategorií při mountu
  // ----------------------------------------------------------
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY_CATEGORIES);
        setCategories(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.log("Chyba při načítání kategorií:", e);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // ----------------------------------------------------------
  // uložíme kategorie do AsyncStorage
  // ----------------------------------------------------------
  const saveCategories = async (newCategories) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(newCategories));
    } catch (e) {
      console.log("Chyba při ukládání kategorií:", e);
    }
  };

  // ----------------------------------------------------------
  // přidání nové kategorie
  // ----------------------------------------------------------
  const addCategory = () => {
    if (!newCategory.trim()) return;

    const updated = [...categories, { name: newCategory.trim(), subcategories: [] }];
    setCategories(updated);
    saveCategories(updated);
    setNewCategory("");
  };

  // ----------------------------------------------------------
  // přidání podkategorie do vybrané kategorie
  // ----------------------------------------------------------
  const addSubcategory = () => {
    if (!selectedCategory || !newSubcategory.trim()) return;

    const updated = categories.map(cat => {
      if (cat.name === selectedCategory) {
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSubcategory.trim()]
        };
      }
      return cat;
    });

    setCategories(updated);
    saveCategories(updated);
    setNewSubcategory("");
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Kategorie</Text>

      {/* Přidání nové kategorie */}
      <TextInput
        style={styles.input}
        placeholder="Nová kategorie"
        value={newCategory}
        onChangeText={setNewCategory}
      />
      <TouchableOpacity style={styles.button} onPress={addCategory}>
        <Text style={styles.btnText}>Přidat kategorii</Text>
      </TouchableOpacity>

      {/* Výběr kategorie pro podkategorie */}
      <FlatList
        data={categories}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 8,
              backgroundColor: selectedCategory === item.name ? "orange" : "#eee",
              marginBottom: 4,
              borderRadius: 6
            }}
            onPress={() => setSelectedCategory(item.name)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Přidání podkategorie */}
      {selectedCategory && (
        <>
          <TextInput
            style={styles.input}
            placeholder={`Nová podkategorie pro ${selectedCategory}`}
            value={newSubcategory}
            onChangeText={setNewSubcategory}
          />
          <TouchableOpacity style={styles.button} onPress={addSubcategory}>
            <Text style={styles.btnText}>Přidat podkategorii</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Zobrazení všech kategorií s podkategoriemi */}
      <FlatList
        data={categories}
        keyExtractor={item => item.name + "-list"}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            {item.subcategories.map(sub => (
              <Text key={sub} style={{ marginLeft: 10 }}>- {sub}</Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}
