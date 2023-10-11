import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { Stack, useLocalSearchParams } from "expo-router";

const fetchApiData = async function (route) {
    try {
        const response = await fetch(route);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const removeHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, "");
};

const Book = () => {
    const { id, secondId } = useLocalSearchParams();

    const [isLoading, setIsLoading] = useState(true);
    const [bothTexts, setBothTexts] = useState([]);
    const [clickedWords, setClickedWords] = useState({});
    const [savedWords, setSavedWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const loadClickedWords = async () => {
            const storedClickedWords = await AsyncStorage.getItem(
                "clickedWords"
            );

            if (storedClickedWords) {
                setClickedWords(JSON.parse(storedClickedWords));
            }
        };

        loadClickedWords();

        fetchApiData(
            `https://bitsandpiecesschool.com/api/posts/${secondId}`
        ).then((data) => {
            if (data) {
                const text1Paragraphs = data.content
                    .split("</p>")
                    .map(removeHtmlTags);

                fetchApiData(
                    `https://bitsandpiecesschool.com/api/posts/${id}`
                ).then((data) => {
                    if (data) {
                        const text2Paragraphs = data.content
                            .split("</p>")
                            .map(removeHtmlTags);

                        const mergedTexts = text1Paragraphs.map(
                            (firstText, index) => ({
                                firstText,
                                secondText: text2Paragraphs[index],
                            })
                        );

                        setBothTexts(mergedTexts);
                        setIsLoading(false);
                    }
                });
            }
        });
    }, []);

    const handleWordClick = (wordIndex, textNumber, paragraphIndex) => {
        const newClickedWords = { ...clickedWords };

        if (!newClickedWords[paragraphIndex]) {
            newClickedWords[paragraphIndex] = {};
        }

        if (!newClickedWords[paragraphIndex][textNumber]) {
            newClickedWords[paragraphIndex][textNumber] = [];
        }

        if (!newClickedWords[paragraphIndex][textNumber].includes(wordIndex)) {
            newClickedWords[paragraphIndex][textNumber].push(wordIndex);
        } else {
            const indexToRemove =
                newClickedWords[paragraphIndex][textNumber].indexOf(wordIndex);

            if (indexToRemove !== -1) {
                newClickedWords[paragraphIndex][textNumber].splice(
                    indexToRemove,
                    1
                );
            }
        }

        setClickedWords(newClickedWords);
        AsyncStorage.setItem("clickedWords", JSON.stringify(newClickedWords));

        setSelectedWords(getSelectedWords(clickedWords));
    };

    const getSelectedWords = (clickedWords) => {
        const selectedWords = [];
        Object.keys(clickedWords).forEach((paragraphIndex) => {
            const paragraphData = clickedWords[paragraphIndex];
            Object.keys(paragraphData).forEach((textNumber) => {
                const textData = bothTexts[paragraphIndex];
                if (textData) {
                    const text =
                        textNumber === 1
                            ? textData.firstText
                            : textData.secondText;
                    const words = text.split(" ");
                    const selectedWordIndexes = paragraphData[textNumber];
                    selectedWordIndexes.forEach((wordIndex) => {
                        if (words[wordIndex]) {
                            selectedWords.push(words[wordIndex]);
                        }
                    });
                }
            });
        });
        return selectedWords;
    };

    const handleWordsSave = () => {
        const clickedWordsArray = Array.isArray(clickedWords)
            ? clickedWords
            : [clickedWords];

        const newClickedWords = clickedWordsArray.filter(
            (word) => !savedWords.includes(word)
        );

        const combinedArray = [...savedWords, ...newClickedWords];

        setSavedWords(combinedArray);

        const savedWordsArray = [];

        combinedArray.map((word) => {
            savedWordsArray.push(getSelectedWords(word.replace(/\n/g, "")));
        });

        AsyncStorage.setItem("savedWords", JSON.stringify(savedWordsArray));
    };

    const isWordClicked = (wordIndex, textNumber, paragraphIndex) => {
        const clickedWordsInParagraph = clickedWords[paragraphIndex] || {};
        const clickedWordsInText = clickedWordsInParagraph[textNumber] || [];
        return clickedWordsInText.includes(wordIndex);
    };

    const scrollViewRef = useRef(null);

    const handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        setScrollPosition(y);
        AsyncStorage.setItem("scrollPosition", y.toString()); // Store the scroll position
    };

    useEffect(() => {
        // Restore scroll position
        AsyncStorage.getItem("scrollPosition").then((position) => {
            if (position) {
                scrollViewRef.current?.scrollTo({
                    y: parseFloat(position),
                    animated: false,
                });
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ header: () => null }} />
            {isLoading ? (
                <LottieView
                    loop={false}
                    autoPlay
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        height: 150,
                        marginTop: 70,
                        width: 320,
                        zIndex: 1000,
                        pointerEvents: "none",
                        display: "none",
                    }}
                    source={require("../assets/loading.json")}
                />
            ) : (
                <View style={styles.side}>
                    <TouchableOpacity onPress={() => handleWordsSave()}>
                        <LottieView
                            loop={false}
                            autoPlay
                            style={{
                                width: 40,
                                marginTop: -10,
                                zIndex: 1000,
                                pointerEvents: "none",
                            }}
                            source={require("../assets/bookmark.json")}
                        />
                    </TouchableOpacity>
                    <ScrollView
                        ref={scrollViewRef}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {bothTexts.map((item, paragraphIndex) => (
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 20,
                                }}
                                key={paragraphIndex}
                            >
                                <Text style={styles.paragraphContainer}>
                                    {item.firstText
                                        .split(" ")
                                        .map((word, wordIndex) => (
                                            <Text
                                                key={wordIndex}
                                                onPress={() =>
                                                    handleWordClick(
                                                        wordIndex,
                                                        1,
                                                        paragraphIndex
                                                    )
                                                }
                                                style={styles.wordContainer}
                                            >
                                                <Text
                                                    style={[
                                                        styles.text,
                                                        isWordClicked(
                                                            wordIndex,
                                                            1,
                                                            paragraphIndex
                                                        )
                                                            ? {
                                                                  textDecoration:
                                                                      "underline",
                                                              }
                                                            : null,
                                                    ]}
                                                >
                                                    {word.replace(/\n/g, "")}{" "}
                                                </Text>
                                            </Text>
                                        ))}
                                </Text>
                                <Text style={styles.paragraphContainer}>
                                    {item.secondText
                                        .split(" ")
                                        .map((word, wordIndex) => (
                                            <Text
                                                key={wordIndex}
                                                onPress={() =>
                                                    handleWordClick(
                                                        wordIndex,
                                                        2,
                                                        paragraphIndex
                                                    )
                                                }
                                                style={styles.wordContainer}
                                            >
                                                <Text
                                                    style={[
                                                        styles.text,
                                                        isWordClicked(
                                                            wordIndex,
                                                            2,
                                                            paragraphIndex
                                                        )
                                                            ? {
                                                                  textDecoration:
                                                                      "underline",
                                                              }
                                                            : null,
                                                    ]}
                                                >
                                                    {word.replace(/\n/g, "")}{" "}
                                                </Text>
                                            </Text>
                                        ))}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    side: {
        flex: 1,
        padding: 10,
        flexDirection: "column",
    },
    paragraphContainer: {
        display: "inline-block",
        width: "50%",
        textAlign: "justify",
        flex: 1,
        textIndent: 20,
    },
    wordContainer: {
        alignItems: "flex-start",
        textAlign: "justify",
        flex: 1,
    },
    text: {
        lineHeight: 18,
        fontSize: 12,
    },
});

export default Book;
