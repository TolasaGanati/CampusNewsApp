import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useBookmarkContext } from "../News_Articles/bookmarkContext"; // Adjust the path accordingly

const FavoriteScreen = () => {
  const { getBookmarks, removeBookmark } = useBookmarkContext();
  const [bookmarkedArticles, setBookmarkedArticles] = useState(getBookmarks());
  const navigation = useNavigation();

  useEffect(() => {
    // Update the local state when bookmarks change
    setBookmarkedArticles(getBookmarks());
  }, [getBookmarks]);

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
      {/* <TouchableOpacity
        style={styles.removeBookmarkButton}
        onPress={() => removeBookmark(item.title)}
      >
        <Text style={styles.removeBookmarkButtonText}>Remove Bookmark</Text>
      </TouchableOpacity> */}
    </View>
  );

  const truncateContent = (content) => {
    const maxLength = 12000;
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "relative", left: 0 }}
          >
            <MaterialIcons name="keyboard-arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Favorite Articles</Text>
        </View>
      </View>
      <FlatList
        data={bookmarkedArticles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        ListEmptyComponent={() => (
          <Text>No bookmarked articles available.</Text>
        )}
      />
    </View>
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


export default FavoriteScreen;
