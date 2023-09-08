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
            label: "Intermediate (3000)",
            value: "/3000_EnglUkrGame",
        },
        { label: "на 4 букви", value: "/construct-words?words=4" },
        { label: "за картинкою", value: "/construct-words-pic" },
    ]);

    const [open2, setOpen2] = useState(false);
    const [value2, setValue2] = useState(null);
    const [items2, setItems2] = useState([
        {
            label: "знайди букви",
            value: "/alphabet",
        },
        {
            label: "знайди букви за картинкою",
            value: "/alphabet-pic",
        },
        { label: "запам'ятай букви", value: "/memory-game" },
    ]);


    return (
        <View style={{ width: "100%", height: "100%" }}>
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Babbler",
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
                        width: 150,
                    }}
                >
                    <DropDownPicker
                        open={open2}
                        placeholder="Memory Games"
                        value={value2}
                        items={items2}
                        labelStyle={{
                            color: "#ff5722",
                            fontWeight: "bold",
                        }}
                        placeholderStyle={{
                            color: "#ff5722",
                            fontWeight: "bold",
                        }}
                        listItemLabelStyle={{
                            color: "#ff5722",
                            fontWeight: "bold",
                        }}
                        modalTitleStyle={{
                            fontWeight: "bold",
                        }}
                        setOpen={setOpen2}
                        setValue={setValue2}
                        setItems={setItems2}
                        onChangeValue={(value) => {
                            router.push(value);
                        }}
                        zIndex={2000}
                        zIndexInverse={4000}
                    />
                    <View style={{ margin: 4 }} />
                    <DropDownPicker
                        open={open}
                        placeholder="Memory Games"
                        value={value}
                        items={items}
                        labelStyle={{
                            color: "#ff5722",
                            fontWeight: "bold",
                        }}
                        placeholderStyle={{
                            color: "#ff5722",
                            fontWeight: "bold",
                        }}
                        listItemLabelStyle={{
                            color: "#ff5722",
                            fontWeight: "bold",
                        }}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        onChangeValue={(value) => {
                            router.push(value);
                        }}
                        zIndex={1000}
                        zIndexInverse={3000}
                    />
                    <StatusBar hidden />
                </View>
            </ImageBackground>
        </View>
    );
}
