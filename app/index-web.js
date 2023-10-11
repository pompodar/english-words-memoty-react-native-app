import { Stack, Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import DropDownPicker from "react-native-dropdown-picker";
import "../style.css";
import LottieView from "react-native-web-lottie";

export default function Home() {    
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {
            label: "J. Joyce The Sisters",
            value: "/book-web?id=1&secondId=2",
        },
    ]);

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Bibookish",
                }}
            />
            <LottieView
                loop={false}
                autoPlay
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    width: 200,
                    zIndex: 1000,
                    pointerEvents: "none",
                }}
                source={require("../assets/book.json")}
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
                    <View style={{ margin: 4 }} />
                    <DropDownPicker
                        open={open}
                        placeholder="твори"
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
