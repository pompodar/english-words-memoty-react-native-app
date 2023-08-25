import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import Modal from "react-native-modal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link, router } from "expo-router";

const initialSentences = [
    "рак",
    "сир",
    "сон",
    "бик",
    "дим",
    "дах",
    "дід",
    "дощ",
    "душ",
    "жук",
    "зуб",
    "їжа",
    "кит",
    "кіт",
    "лев",
    "чай",
    "час",
    "цар",
    "сад",
    "ріг",
    "піч",
    "пес",
    "око",
    "ніч",
    "ніс",
    "ніж",
    "меч",
    "мед",
    "мак",
    "лук",
    "ліс",
];

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const ConstructWords = () => {
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

    const [word, setWord] = useState("");

    const [currentWordToConstruct, setCurrentWordToConstruct] = useState("");

    const [sentenceNumber, setSentenceNumber] = useState(0);

    const [sentences, setSentences] = useState(
        shuffleArray([...initialSentences])
    );
    const [jumbledWords, setJumbledWords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const [score, setScore] = useState(0);

    useEffect(() => {
        if (sentences.length > 0) {
            const sentence = sentences[0];
            const initialWordArray = sentence
                .split("")
                .map((word, index) => ({ key: `${index}`, label: word }));
            setJumbledWords(shuffleArray([...initialWordArray])); // Randomize the initial order
               setCurrentWordToConstruct(sentence);
        }
    }, [sentences]);

    const checkAnswer = () => {
        if (sentences.length === 0) {
            return;
        }

        setSentenceNumber(sentenceNumber + 1);

        const correctOrder = sentences[0].split("");
        const userOrder = jumbledWords.map((item) => item.label);
        const isAnswerCorrect = userOrder.join("") === correctOrder.join("");
        setWord(correctOrder.join(""));

        if (isAnswerCorrect) {
            setScore(score + 1);
        }
        setIsModalVisible(true);

        setModalContent(
            <View>
                <Text>{isAnswerCorrect ? "Correct!" : "Try Again"}</Text>
                <Text>The answer is: {correctOrder.join(" ")}</Text>
                {sentenceNumber < 5 ? (
                    <TouchableOpacity onPress={() => nextSentence()}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={back}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const nextSentence = () => {
        const remainingSentences = [...sentences];
        remainingSentences.shift();
        setSentences(remainingSentences);
        setIsModalVisible(false);
    };

    function back() {
        setIsModalVisible(false);
        router.replace("/");
    }

    const [modalContent, setModalContent] = useState(null);

    const renderItem = ({ item, index, drag, isActive }) => (
        <TouchableOpacity
            style={{
                backgroundColor: isActive ? "red" : "white",
                padding: 10,
                paddingLeft: 18,
                paddingRight: 18,
                margin: 10,
            }}
            onLongPress={isModalVisible ? undefined : drag} // Disable dragging when the modal is visible
        >
            <Text
                style={{
                    fontSize: 22,
                }}
            >
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
            }}
        >
            {sentences.length > 0 ? (
                <>
                    <Text
                        style={{
                            alignSelf: "center",
                        }}
                    >
                        Склади слово: <span>{currentWordToConstruct}</span>
                    </Text>
                    <GestureHandlerRootView>
                        <DraggableFlatList
                            data={jumbledWords}
                            renderItem={renderItem}
                            horizontal
                            keyExtractor={(item) => item.key}
                            onDragEnd={({ data }) => setJumbledWords(data)}
                            style={{
                                alignSelf: "center",
                                margin: 18,
                            }}
                        />
                    </GestureHandlerRootView>
                    <TouchableOpacity onPress={() => checkAnswer()}>
                        <Text
                            style={{
                                alignSelf: "center",
                                width: 50,
                                height: 50,
                                backgroundColor: "aqua",
                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 0,
                                    height: 30,
                                },
                                shadowOpacity: 0.17,
                                shadowRadius: 3.05,
                                elevation: 4,
                                borderRadius: 50,
                                margin: "auto",
                            }}
                        ></Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text>No more sentences to arrange.</Text>
            )}

            <Modal isVisible={isModalVisible} backdropOpacity={0.1}>
                {modalContent}
                <Text>{score}</Text>
            </Modal>
            <StatusBar hidden />
        </View>
    );
};

export default ConstructWords;
