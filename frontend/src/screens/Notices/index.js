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
const Notices = ({ user, isLoggedIn, accessToken, ...props }) => {
  const [notices, setNotices] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const data = async () => {
      try {
        const response = await fetch("http://10.194.65.24:3000/notices");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setNotices(data);
      } catch (err) {
        console.log("Error occurred:", err);
      }
    };
    data();
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.noticeContainer}>
      <Image source={{ uri: item.noticesImage }} style={styles.noticeImage} />
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeDescription}>
        {truncateContent(item.content)}
      </Text>
      <TouchableOpacity
        style={{
          padding: 10,
          borderRadius: 30,
          color: "#fff",
          height: 40,
          width: "90%",
          alignItems: "center",
          marginLeft: 20,
          marginRight: 20,
          fontWeight: "bold",
          lineHeight: 40,
          backgroundColor: "#12aFFF",
        }}
        onPress={() => navigateToNoticeDetails(item)}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Read More
        </Text>
      </TouchableOpacity>
    </View>
  );
  // Function to truncate content
  const truncateContent = (content) => {
    const maxLength = 100; // You can adjust this value
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };
  const navigateToNoticeDetails = (notice) => {
    console.log("the function is called");
    navigation.navigate("NoticeDetails", { notice });
  };
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={notices}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={() => (
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
              style={{
                position: "relative",
                left: 0,
              }}
            >
              <MaterialIcons name="keyboard-arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={{ fontWeight: "bold" }}></Text>

            <Text
              style={{
                color: "#12aFFF",
                fontWeight: "bold",
              }}
            >
              WELCOME TO WOLKITE UNIVERSITY NOTICES
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
  noticeContainer: {
    marginBottom: 20,
  },
  noticeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 12,
    marginTop: 14,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  noticeDescription: {
    marginTop: 4,
    marginBottom: 12,
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
export default connect(mapStateToProps, mapDispatchToProps)(Notices);
