import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import wordPairs from "../dicts/3000_EnglUkrDict/3000_english_words";
import LottieView from "lottie-react-native";

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
    const [timerValue, setTimerValue] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true); // Start the timer automatically

    useEffect(() => {
        let interval;

        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimerValue((prevValue) => prevValue + 1);
            }, 1000); // Update the timer every 1000ms (1 second)
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval); // Cleanup on unmount or isTimerRunning change
    }, [isTimerRunning]);

    const stopTimer = () => {
        setIsTimerRunning(false);
    };

    const resetTimer = () => {
        setTimerValue(0);
        setIsTimerRunning(false);
    };

    const [cards, setCards] = useState(generateCards());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [disabled, setDisabled] = useState(false);

    const [jsonData, setJsonData] = useState([]);

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

                setMatchedCardCount((prevCount) => prevCount + 2);
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

        if (matchedCardCount == cards.length - 2) {
            setLastTwoCardsMatched((prevCount) => prevCount + 1);
        }

        if (isGameWon()) {
            // Trigger the confetti animation when the game is won
            triggerConfetti();
            stopTimer();
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

    const startGame = () => {
        // Reset game state
        setTimerValue(0);
        setIsTimerRunning(true);
        setCards(generateCards());
        setFlippedIndices([]);
        setDisabled(false);
    };

    const confettiRef = useRef(null);

    function triggerConfetti() {
        if (confettiRef.current) {
            confettiRef.current.play(0);
        }
    }

    const [matchedCardCount, setMatchedCardCount] = useState(0);

    const [lastTwoCardsMatched, setLastTwoCardsMatched] = useState(0);

    const isGameWon = () => {
        console.log(lastTwoCardsMatched);
        // Check if all cards are matched
        if (matchedCardCount === cards.length - 2 && lastTwoCardsMatched == 1) {
            // Trigger the confetti animation when all cards are matched
            return true;
        } else {
            return false;
        }
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
            <LottieView
                ref={confettiRef}
                resizeMode="cover"
                loop={false}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: 1000,
                    pointerEvents: "none",
                }}
                source={require("../assets/confetti.json")}
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
            <TouchableOpacity
                onPress={startGame}
                style={{
                    position: "absolute",
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    left: 20,
                    top: 20,
                    backgroundColor: "#ff5722",
                    borderRadius: 50,
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
                <FontAwesome name="hourglass-start" size={14} color="white" />
            </TouchableOpacity>
            <View
                style={{
                    position: "absolute",
                    minWidth: 40,
                    minHeight: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    right: 20,
                    top: 20,
                    padding: 8,
                    backgroundColor: "#ff5722",
                    borderRadius: 50,
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
                <Text
                    style={{
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    {timerValue}
                </Text>
            </View>
            <FlatList
                style={{ position: "absolute" }}
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
        minWidth: 90,
        height: 60,
        padding: 8,
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
    startButton: {
        position: "absolute",
        bottom: 20,
        backgroundColor: "#2196F3",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
});

export default MemoryGame;
