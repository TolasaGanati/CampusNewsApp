import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
const searchArticles = async () => {
  try {
    const response = await axios.get("http://10.194.65.24:3000/news");

    // Filter articles based on the entered text
    const filteredArticles = searchText
      ? response.data.filter((item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

    setArticles(filteredArticles);


  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    searchArticles(); // Initial load with empty search text
  }, [searchText]); // Trigger searchArticles when searchText changes
  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSubmit={searchArticles}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={articles.map((item) => ({
            newsImage: item.newsImage,
            title: item.title,
            content: item.content,
          }))}
          renderItem={({ item }) => (
            <View>
              <Image
                style={styles.articleImage}
                source={{ uri: `data:image/jpeg;base64,${item.newsImage}` }}
              />
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleContent}>{item.content}</Text>
            </View>
          )}
          keyExtractor={(item) => item.title}
          ListEmptyComponent={
            <Text style={{color:"red"}}>
              {searchText ?    `There is no articles found with ${searchText} title. `: "             No articles available."}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  backButton: {
    position: "relative",
    left: 0,
  },
  headerText: {
    color: "#12aFFF",
    fontWeight: "bold",
  },
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

export default SearchScreen;
