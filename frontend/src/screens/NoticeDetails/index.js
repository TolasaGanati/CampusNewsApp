import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const NoticeDetails = ({ route }) => {
  const { notice } = route.params;
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View
        style={{
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 0,
          }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold" }}></Text>
      </View>
      <Text style={{ fontWeight: "bold", alignSelf: "center" }}>
        Notice Details
      </Text>
      <Image source={{ uri: notice.noticesImage }} style={styles.noticeImage} />
      <Text style={styles.noticeTitle}>{notice.title}</Text>
      <ScrollView>
        <Text style={styles.noticeContent}>{notice.content}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noticeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  noticeContent: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default NoticeDetails;
