import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home() {
    return (
        <View>
            <Link href="/construct-words">Складати слова</Link>
            <StatusBar hidden />
        </View>
    );
}
