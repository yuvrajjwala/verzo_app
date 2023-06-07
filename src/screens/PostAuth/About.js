import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import React from "react";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { Colors } from "../../global";
import Header from "../../components/Header";
import { POSTCALL } from "../../global/server";
import CustomButton from "../../components/CustomButton";
import { retrieveData } from "../../utils/Storage";
import Spinner from "react-native-loading-spinner-overlay";
import { hideMessage, showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-gesture-handler";

const About = ({ navigation }) => {
  const [loader, setLoader] = React.useState(false);
  const [about, setAbout] = React.useState("");
  const { dryCleanerProfile } = useSelector((state) => state.drycleanerreducer);

  const updateMerchantProfile = async () => {
    setLoader(true);
    let data = await retrieveData("userdetails");
    let tempReducer = JSON.parse(JSON.stringify(dryCleanerProfile));
    let { availability, acceptItems, images } = tempReducer;

    if (data && data.token) {
      await POSTCALL(
        "api/update-my-dry-cleaner-profile",
        { acceptItems, availability, images, about },
        data.token
      );
      setLoader(false);
      showMessage({
        message: `Merchant Profile Updated Successfully!`,
        type: "success",
        style: {
          alignItems: "center",
        },
        autoHide: false,
      });
      setTimeout(() => {
        hideMessage();
        navigation.navigate("Home");
      }, 500);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#4C4C4C" }}>
      <FocusAwareStatusBar isLightBar={false} isTopSpace={true} />
      {/* <Spinner visible={loader} textContent={'Loading...'} /> */}
      <View style={styles.screen}>
        <Header />
        <View style={{ marginTop: 20 }} />
        <View style={{ marginHorizontal: 32 }}>
          <Text style={{ color: "#000", fontSize: 22 }}>Name And Address</Text>
          <View style={{ height: 20 }} />
          <TextInput
            multiline
            style={styles.textArea}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Enter") {
                setAbout(about + "\n");
              }
            }}
            value={about}
            onChangeText={(data) => {
              setAbout(data);
            }}
          />
          <View style={{ height: 20 }} />
          <CustomButton
            customStyle={{
              backgroundColor: "#F99025",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              borderRadius: 25,
              marginHorizontal: 20,
            }}
            buttonText={"Finish"}
            onPress={() => {
              updateMerchantProfile();
            }}
            textStyle={{
              color: Colors.WHITE,
              fontSize: 20,
              fontWeight: "bold",
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default About;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F7F6F9",
    flex: 1,
  },
  textArea: {
    height: 100,
    borderRadius: 10,
    borderColor: "#F99025",
    borderWidth: 1,
    color: "black",
    textAlignVertical: "top",
    paddingHorizontal: 10,
  },
});
