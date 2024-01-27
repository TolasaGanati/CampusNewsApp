import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useBookmarkContext } from "./bookmarkContext";

const News_Articles = ({ user, isLoggedIn, accessToken, ...props }) => {
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const navigation = useNavigation();
  const { toggleBookmark, getBookmarks } = useBookmarkContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://10.194.65.24:3000/news");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data || []); // Ensure data is an array or default to an empty array
      } catch (err) {
        console.log("Error occurred:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update the local state when bookmarks change
    setBookmarks(getBookmarks());
  }, [getBookmarks]); // Trigger the effect when getBookmarks() changes

  const renderItem = ({ item }) => (
    <View style={styles.articleContainer}>
      <Image
        style={styles.articleImage}
        source={{ uri: `data:image/jpeg;base64,${item.newsImage}` }}
      />
      {/* <Image source={{ uri: item.newsImage }} style={styles.articleImage} /> */}
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleDescription}>
        {truncateContent(item.content)}
      </Text>
      <TouchableOpacity
        style={styles.readMoreButton}
        onPress={() => navigateToArticleDetails(item)}
      >
        <Text style={styles.buttonText}>Read More</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.bookmarkButton,
          {
            backgroundColor: bookmarks.some((b) => b.title === item.title)
              ? "#FF0000" // Red background if bookmarked
              : "#11aaaa", // Green background if not bookmarked
          },
        ]}
        onPress={() => toggleBookmark(item)}
      >
        <Text style={styles.buttonText}>
          {bookmarks.some((b) => b.title === item.title)
            ? "Remove Bookmark"
            : "Bookmark"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const truncateContent = (content) => {
    const maxLength = 200;
    return content && content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  const navigateToArticleDetails = (article) => {
    console.log("the function is called");
    navigation.navigate("ArticleDetails", { article });
  };

  if (!articles || articles.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={articles}
      renderItem={renderItem}
      keyExtractor={(item) => item.title}
      ListHeaderComponent={() => (
        <View>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons name="keyboard-arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              WELCOME TO WOLKITE UNIVERSITY NEWS
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
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
  articleContainer: {
    marginBottom: 20,
  },
  articleImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 12,
    marginTop: 14,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    alignSelf: "center",
  },
  articleDescription: {
    marginTop: 4,
    marginBottom: 12,
  },
  readMoreButton: {
    width: "90%",
    borderRadius: 30,
    paddingHorizontal: 20,
    textAlign: "center",
    height: 40,
    width: "90%",
    fontWeight: "bold",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    lineHeight: 40,
    backgroundColor: "#12aFFF",
  },
  bookmarkButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    color: "#fff",
    height: 40,
    width: "90%",
    marginLeft: 20,
    marginRight: 20,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.accessToken,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(News_Articles);
