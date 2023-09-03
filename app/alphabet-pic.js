import React, { useState, useEffect } from "react";
import { Image, TouchableOpacity, ImageBackground, View, Text, Button } from "react-native";
import Modal from "react-native-modal";
import { Stack, Link, router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const alphabet = [
    "А",
    "Б",
    "В",
    "Г",
    "Ґ",
    "Д",
    "Ж",
    "З",
    "І",
    "Ї",
    "К",
    "Л",
    "М",
    "Н",
    "О",
    "П",
    "Р",
    "С",
    "Т",
    "У",
    "Ф",
    "Х",
    "Ц",
    "Ч",
    "Ш",
    "Щ",
    "Ю",
    "Я",
];

const imagePaths = {
    A: require("../assets/alph-pic/акула.png"),
    Б: require("../assets/alph-pic/бик.png"),
    В: require("../assets/alph-pic/вовк.png"),
    Г: require("../assets/alph-pic/гриб.png"),
    Ґ: require("../assets/alph-pic/ґудзик.png"),
    Д: require("../assets/alph-pic/дим.png"),
    Є: require("../assets/alph-pic/єнот.png"),
    Ж: require("../assets/alph-pic/жираф.png"),
    З: require("../assets/alph-pic/зуб.png"),
    Ї: require("../assets/alph-pic/їжак.png"),
    І: require("../assets/alph-pic/індик.png"),
    Й: require("../assets/alph-pic/йогурт.png"),
    К: require("../assets/alph-pic/кіт.png"),
    Л: require("../assets/alph-pic/лев.png"),
    М: require("../assets/alph-pic/мед.png"),
    Н: require("../assets/alph-pic/ніж.png"),
    О: require("../assets/alph-pic/око.png"),
    П: require("../assets/alph-pic/пес.png"),
    Р: require("../assets/alph-pic/ріг.png"),
    С: require("../assets/alph-pic/слон.png"),
    Т: require("../assets/alph-pic/тигр.png"),
    У: require("../assets/alph-pic/удав.png"),
    Ф: require("../assets/alph-pic/фарба.png"),
    Х: require("../assets/alph-pic/хліб.png"),
    Ц: require("../assets/alph-pic/цап.png"),
    Ч: require("../assets/alph-pic/чай.png"),
    Ш: require("../assets/alph-pic/шкарпетка.png"),
    Щ: require("../assets/alph-pic/щит.png"),
    Ю: require("../assets/alph-pic/юшка.png"),
    Я: require("../assets/alph-pic/яблуко.png"),
};

export default function AphPic() {
    

    const [currentLetter, setCurrentLetter] = useState("");
    const [options, setOptions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

    const [sentenceNumber, setSentenceNumber] = useState(0);

        const [score, setScore] = useState(0);


    useEffect(() => {
        getNextQuestion();
    }, []);

    function back() {
        setIsModalVisible(false);
        router.replace("/");
    }

    const getNextQuestion = () => {
        setSentenceNumber(sentenceNumber + 1);
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const letter = alphabet[randomIndex];
        setCurrentLetter(letter);
        const newOptions = getRandomOptions(letter);
        setOptions(newOptions);
    };

    const handleOptionSelect = (selectedOption) => {
        const isCorrect = selectedOption === currentLetter;

        setIsAnswerCorrect(isCorrect);
        if (isCorrect) {
            setScore(score + 1);
        }
        setIsModalVisible(true);
    };

    const handleNext = () => {
        setIsModalVisible(false);
        getNextQuestion();
    };

    function getRandomOptions(answer) {
        const options = [answer];

        while (options.length < 3) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            const randomOption = alphabet[randomIndex];
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        return shuffleArray(options);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

     const imageSource = imagePaths[currentLetter];

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
            }}
        >
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Алфавіт з картинками",
                }}
            />
            <ImageBackground
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                }}
                source={require("../assets/background.jpg")}
                resizeMode="cover"
            >
                <View
                    style={{
                        backgroundColor: "red",
                        padding: 30,
                        width: 290,
                        height: 290,
                        borderRadius: 150,
                        alignSelf: "center",
                        backgroundColor: "white",
                        shadowColor: "#000000",
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.17,
                        shadowRadius: 3.05,
                        elevation: 10,
                        position: "relative",
                    }}
                >
                    <View
                        style={{
                            shadowColor: "#000000",
                            shadowOffset: {
                                width: 0,
                                height: 10,
                            },
                            shadowOpacity: 0.17,
                            shadowRadius: 3.05,
                            elevation: 10,
                            position: "absolute",
                            top: 24,
                            right: 24,
                            fontSize: 18,
                            width: 50,
                            height: 50,
                            backgroundColor: "#03a9f4",
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            {score + " / 5"}
                        </Text>
                    </View>
                    <Image
                        style={{
                            width: 120,
                            height: 120,
                            marginTop: -50,
                            alignSelf: "center",
                        }}
                        source={imageSource}
                    />
                    <TouchableOpacity>
                        {options.map((option, index) => (
                            <View
                                style={{
                                    alignSelf: "center",
                                    width: 50,
                                    height: 40,
                                    marginTop: 14,
                                    color: "white",
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                    backgroundColor: "aqua",
                                    shadowColor: "#000000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 10,
                                    },
                                    shadowOpacity: 0.17,
                                    shadowRadius: 3.05,
                                    elevation: 10,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                key={index.toString()}
                            >
                                <Text
                                    key={index.toString()}
                                    onPress={() => handleOptionSelect(option)}
                                    style={{
                                        color: "white",
                                        lineHeight: "3",
                                        width: "100%",
                                        textAlign: "center",
                                    }}
                                >
                                    {option}
                                </Text>
                            </View>
                        ))}
                    </TouchableOpacity>
                </View>
                <Modal isVisible={isModalVisible}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: isAnswerCorrect
                                ? "aqua"
                                : "#e64a19",
                            borderRadius: 80,
                            width: 140,
                            height: 140,
                            padding: 30,
                            alignSelf: "center",
                            shadowColor: "#000000",
                            shadowOffset: {
                                width: 0,
                                height: 10,
                            },
                            shadowOpacity: 0.17,
                            shadowRadius: 3.05,
                            elevation: 10,
                        }}
                    >
                        <Text style={{ display: "none" }}>dummy</Text>
                        <Text>
                            {isAnswerCorrect ? (
                                <Entypo
                                    name="emoji-happy"
                                    size={34}
                                    color="white"
                                />
                            ) : (
                                <Entypo
                                    name="emoji-neutral"
                                    size={34}
                                    color="white"
                                />
                            )}
                        </Text>
                        {sentenceNumber < 5 ? (
                            <TouchableOpacity onPress={() => handleNext()}>
                                <AntDesign
                                    name="rightcircleo"
                                    size={22}
                                    style={{ marginTop: 8 }}
                                    color="white"
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={back}>
                                <AntDesign
                                    name="leftcircleo"
                                    size={22}
                                    style={{ marginTop: 8 }}
                                    color="white"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </Modal>
            </ImageBackground>
        </View>
    );
}
