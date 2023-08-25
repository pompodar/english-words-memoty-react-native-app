import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import DropDownPicker from "react-native-dropdown-picker";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {
            label: "на 3 букви",
            value: "/construct-words",
        },
        { label: "на 4 букви", value: "/construct-words" },
    ]);

    const handleSelect = (itemValue) => {
    // Navigate to the selected page
    if (itemValue === "apple") {
console.log(itemValue);    }

    // Close the dropdown
    setOpen(false);

    // Set the selected value
    setValue(itemValue);
  };

    return (
        <View>
            <DropDownPicker
                style={{width: 150}}
                open={open}
                placeholder="Складати слова"
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={(value) => {
                    console.log(value);
                    router.replace(value);
                }}
            />
            <StatusBar hidden />
        </View>
    );
}
