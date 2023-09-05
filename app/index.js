import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from "react-native";
import { Stack } from "expo-router";
import wordPairs from "./words";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const generateCards = () => {
    // Shuffle the wordPairs array
    const shuffledWordPairs = shuffleArray(wordPairs);

    // Select the first 6 pairs to create the cards
    const selectedPairs = shuffledWordPairs.slice(0, 9);

    // Create cards from the selected pairs
    const cards = selectedPairs.flatMap((pair, index) => [
        { word: pair.English, language: "english", index },
        { word: pair.Ukrainian, language: "ukrainian", index },
    ]);

    // Shuffle the cards array
    const shuffledCards = shuffleArray(cards);

    return shuffledCards;
};

const MemoryGame = () => {
    const [cards, setCards] = useState(generateCards());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [index1, index2] = flippedIndices;
            const card1 = cards[index1];
            const card2 = cards[index2];
            if (card1.index === card2.index) {
                // Find all matched cards and set them as matched in one update
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.matched || card.index === card1.index
                            ? { ...card, matched: true }
                            : card
                    )
                );
            }

            setDisabled(true);
            setTimeout(() => {
                setFlippedIndices([]);
                setDisabled(false);
            }, 1000);
        }
    }, [flippedIndices]);

    const handleCardPress = (index) => {
        if (
            flippedIndices.length < 2 &&
            !flippedIndices.includes(index) &&
            !disabled
        ) {
            setFlippedIndices((prev) => [...prev, index]);
        }
    };

    const keyExtractor = (item, index) => index.toString();

    const renderItem = ({ item, index }) => {
        const isFlipped = flippedIndices.includes(index) || item.matched;
        return (
            <TouchableOpacity
                style={[styles.card, isFlipped && styles.cardFlipped]}
                onPress={() => handleCardPress(index)}
                disabled={isFlipped || flippedIndices.length >= 2 || disabled}
            >
                {isFlipped && <Text style={styles.cardText}>{item.word}</Text>}
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
                    headerTitle: "Babbler",
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
            <FlatList
                style={{position: "absolute"}}
                data={cards}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3} // Adjust the number of columns as per your design
            />
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
    card: {
        width: 90,
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
        borderRadius: 4,
    },
    cardFlipped: {
        backgroundColor: "white",
    },
    cardText: {
        fontSize: 14,
    },
});

export default MemoryGame;
