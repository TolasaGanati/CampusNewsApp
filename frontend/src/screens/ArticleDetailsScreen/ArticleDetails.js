import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ArticleDetails = ({ route }) => {
  const { article } = route.params;
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
        Article Details
      </Text>
      <Image
        style={styles.articleImage}
        source={{ uri: `data:image/jpeg;base64,${article.newsImage}` }}
      />
      {/* <Image source={{ uri: article.newsImage }} style={styles.articleImage} /> */}
      <Text style={styles.articleTitle}>{article.title}</Text>
      <ScrollView>
        <Text style={styles.articleContent}>{article.content}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  articleImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  articleContent: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default ArticleDetails;
