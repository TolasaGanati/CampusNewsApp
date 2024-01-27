import React, { useEffect } from "react";
import RootNavigation from "./src/navigation/index";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import reduxStore from "./src/redux";
import EStyleSheet from "react-native-extended-stylesheet";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/screens/Setting/AuthContext";
import { BookmarkProvider } from "./src/screens/News_Articles/bookmarkContext";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

const reduxPersistStore = persistStore(reduxStore);

const MainApp = () => {
  useEffect(() => {
    EStyleSheet.build();
  }, []);

  return (
    <BookmarkProvider>
      <AuthProvider>
        <Provider store={reduxStore}>
          <PersistGate persistor={reduxPersistStore}>
            <RootNavigation />
          </PersistGate>
        </Provider>
      </AuthProvider>
    </BookmarkProvider>
  );
};

AppRegistry.registerComponent(appName, () => MainApp);

export default MainApp;
