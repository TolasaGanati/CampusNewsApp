import { Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { moderateScale } from "react-native-size-matters";
export const styles = (background, text, lightGray5, primary, dark) =>
  EStyleSheet.create({
    LoginMain: {
      flex: 1,
      backgroundColor: background,
      paddingLeft: moderateScale(20),
      paddingRight: moderateScale(20),
    },
    headerContainer: {
      height: Dimensions.get("window").height / 4,
      justifyContent: "center",
    },
    welcomeText: {
      fontSize: moderateScale(20),
      fontWeight: "bold",
      color: "#12aFFF",
      alignSelf:"center",
      marginTop:50
    },
    signInText: {
      color: lightGray5,
      fontSize: moderateScale(15),
      letterSpacing: 0.5,
      fontWeight: "bold",
    },
    formContainer: {
      marginTop:0
    },
    inputContainer: {},
    wrapper: {
      marginTop: moderateScale(30),
    },

    input: {
      height: moderateScale(55),
      color: text,
      borderWidth: moderateScale(1),
      borderColor: lightGray5,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(10),
      fontWeight: "bold",
    },

    btnContainer: {
      marginTop: "10%",
    },
    footerContainer: {
      height: Dimensions.get("window").height / 5,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    footerContainerInner: {
      flexDirection: "row",
    },
    signText: {
      marginLeft: moderateScale(5),
      color: dark ? text : primary,
    },
    errorText: {
      color: "red",
    },
  });
