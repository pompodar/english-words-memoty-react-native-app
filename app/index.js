import { Stack, Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import DropDownPicker from "react-native-dropdown-picker";
import "../style.css";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {
            label: "на 3 букви",
            value: "/construct-words?words=3",
        },
        { label: "на 4 букви", value: "/construct-words?words=4" },
    ]);

    const handleSelect = (itemValue) => {
    setOpen(false);

    setValue(itemValue);
  };

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Читусик",
                }}
            />
            <ImageBackground
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                source={require("../assets/background.jpg")}
                resizeMode="cover"
            >
                <View
                    style={{
                        width: 150
                    }}
                >
                    <Text
                        style={{
                            backgroundColor: "white",
                            height: 46,
                            marginBottom: 4,
                            borderRadius: 4,
                            padding: 10,
                            borderWidth: 1,
                            borderStyle: "solid",
                        }}
                        onPress={() => router.push("/alphabet")}
                    >
                        Алфавіт
                    </Text>
                    <DropDownPicker
                        className="dropdown"
                        open={open}
                        placeholder="Склади слова"
                        value={value}
                        items={items}
                        disabledStyle={{
                            opacity: 0.5,
                        }}
                        itemStyle={{
                            color: "red",
                        }}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        onChangeValue={(value) => {
                            router.push(value);
                        }}
                    />
                    <StatusBar hidden />
                </View>
            </ImageBackground>
        </View>
    );
}
