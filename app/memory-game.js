import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const generateCards = () => {
    const ukrainianAlphabet = [
        "А",
        "Б",
        "В",
        "Г",
        "Д",
        "Е",
        "Ж",
        "З",
        "И",
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
        "Ь",
        "Ю",
        "Я",
    ];

    const selectedLetters = shuffleArray(ukrainianAlphabet).slice(0, 6);
    const cards = selectedLetters.concat(selectedLetters);
    return shuffleArray(cards);
};

const MemoryGame = () => {
    const [cards, setCards] = useState(generateCards());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [index1, index2] = flippedIndices;
            if (cards[index1] === cards[index2]) {
                setMatchedPairs((prev) => [...prev, cards[index1]]);
            }
            setDisabled(true);
            setTimeout(() => {
                setFlippedIndices([]);
                setDisabled(false);
            }, 1000);
        }
    }, [flippedIndices, cards]);

    const handleCardPress = (index) => {
        if (
            flippedIndices.length < 2 &&
            !flippedIndices.includes(index) &&
            !disabled
        ) {
            setFlippedIndices((prev) => [...prev, index]);
        }
    };

    const renderCard = (letter, index) => {
        const isFlipped =
            flippedIndices.includes(index) || matchedPairs.includes(letter);
        return (
            <TouchableOpacity
                key={index}
                style={[styles.card, isFlipped && styles.cardFlipped]}
                onPress={() => handleCardPress(index)}
                disabled={isFlipped || flippedIndices.length >= 2 || disabled}
            >
                {isFlipped && <Text style={styles.cardText}>{letter}</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Алфавіт",
                }}
            />
            <View
                style={{
                    position: "absolute",
                    width: 320,
                    height: 320,
                    backgroundColor: "aqua",
                    borderRadius: 200,
                    shadowColor: "#000000",
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.17,
                    shadowRadius: 3.05,
                    elevation: 10,
                }}
            ></View>
            <View style={styles.grid}>
                {cards.map((letter, index) => renderCard(letter, index))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: 300,
    },
    card: {
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e91e63",
        margin: 5,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 10,
        borderRadius: 4
    },
    cardFlipped: {
        backgroundColor: "white",
    },
    cardText: {
        fontSize: 20,
    },
});

export default MemoryGame;
