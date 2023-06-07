import { useFocusEffect } from "@react-navigation/native";
import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { Colors } from "../../global";
import { GETCALL } from "../../global/server";
import { Picker } from "@react-native-picker/picker";
import { retrieveData } from "../../utils/Storage";
import { useDispatch, useSelector } from "react-redux";
import {
  setDrycleanerList,
  setSelectedDryCleaner,
} from "../../state/reducers/DrycleanerReducer";

const DryCleanerList = ({ navigation }) => {
  const [stateList, setStateList] = React.useState([]);
  const { dryCleaners } = useSelector((state) => state.drycleanerreducer);
  const pickerRef = useRef();
  const [selectedState, setSelectedState] = React.useState("");
  const [cityList, setCityList] = React.useState([]);
  const [selectedCity, setSelectedCity] = React.useState("");
  const disPatch = useDispatch();

  React.useEffect(() => {
    if (selectedCity) {
      fetchDrycleanerList(selectedCity);
    }
  }, [selectedCity]);

  const fetchDrycleanerList = async (selectedCity) => {
    let data = await retrieveData("userdetails");
    if (data && data.token) {
      let response = await GETCALL(
        `api/search-dry-cleaner?cityName=${selectedCity}`,
        data.token
      );
      console.log(JSON.stringify(response, null, 4));
      if (response.responseData.success) {
        disPatch(setDrycleanerList(response.responseData.data));
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStateList();
    }, [])
  );

  const fetchStateList = async () => {
    let response = await GETCALL("api/state-list");
    let stateList = response.responseData;
    setStateList(stateList);
  };

  const renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          disPatch(setSelectedDryCleaner(item));
          navigation.navigate("ItemsYouAccept", { userId: item.userId });
        }}
        style={{
          borderRadius: 10,
          backgroundColor: "#FDF1E5",
          padding: 10,
          borderWidth: 1,
          borderColor: "#F99025",
          // ...styles.shadow
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.circle}>
              <Image
                style={styles.user}
                source={require("../../assets/man.png")}
              />
            </View>
            <View style={{ width: 10 }} />
            <Text style={styles.label}>{item.merchantName}</Text>
          </View>
        </View>

        <View style={{ height: 10 }} />
        <View>
          <Text style={styles.label}>Availibility</Text>
        </View>
        <View style={{ height: 10 }} />
        {item.availability.map((single, index) => {
          return (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "center",
              }}
              key={index}
            >
              <Text style={styles.days}>{single.day} :- </Text>
              <View style={{ width: 10 }} />
              <Image
                style={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                  tintColor: "#F99025",
                }}
                source={require("../../assets/clock.png")}
              />
              <View style={{ width: 10 }} />
              <Text style={styles.days}>{single.startTime}</Text>
              <View style={{ width: 10 }} />
              <Image
                style={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                  tintColor: "#F99025",
                }}
                source={require("../../assets/clock.png")}
              />
              <View style={{ width: 10 }} />
              <Text style={styles.days}>{single.endTime}</Text>
            </View>
          );
        })}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <FocusAwareStatusBar isLightBar={false} isTopSpace={true} />
      <View style={styles.container}>
        <View style={{ margin: 8 }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.BLACK,
            }}
          >
            State
          </Text>
          <TouchableOpacity
            onPress={() => {
              pickerRef.current.focus();
            }}
            style={{
              borderColor: Colors.GRAY_MEDIUM,
              borderWidth: 1,
              width: "100%",
              color: "#000000",
              fontSize: 15,
              // width: width - 40,
              borderRadius: 8,
              marginTop: 5,
            }}
          >
            <Picker
              selectedValue={selectedState}
              mode={"dialog"}
              ref={pickerRef}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedState(itemValue);
                setCityList(stateList[itemIndex].city);
              }}
            >
              {stateList.map((state, index) => {
                return (
                  <Picker.Item
                    style={{
                      color: Colors.BLACK,
                    }}
                    key={index}
                    label={state.stateName}
                    value={state.stateSlug}
                  />
                );
              })}
            </Picker>
          </TouchableOpacity>
        </View>
        <View style={{ margin: 8 }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.BLACK,
            }}
          >
            City
          </Text>
          <TouchableOpacity
            onPress={() => {
              pickerRef.current.focus();
            }}
            style={{
              borderColor: Colors.GRAY_MEDIUM,
              borderWidth: 1,
              width: "100%",
              color: "#000000",
              fontSize: 15,
              // width: width - 40,
              borderRadius: 8,
              marginTop: 5,
            }}
          >
            <Picker
              selectedValue={selectedCity}
              mode={"dialog"}
              ref={pickerRef}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCity(itemValue);
              }}
            >
              {cityList.map((city, index) => {
                return (
                  <Picker.Item
                    style={{
                      color: Colors.BLACK,
                    }}
                    key={index}
                    label={city.cityName}
                    value={city.citySlug}
                  />
                );
              })}
            </Picker>
          </TouchableOpacity>
        </View>
        <FlatList
          data={dryCleaners}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 10,
                }}
              />
            );
          }}
          contentContainerStyle={{
            marginHorizontal: 20,
            paddingBottom: 30,
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItems}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default DryCleanerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SMOKEWHITE,
    marginHorizontal: 5,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F99025",
    justifyContent: "center",
    alignItems: "center",
  },
  user: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: Colors.WHITE,
  },
  label: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  days: {
    fontSize: 16,
    color: "#F99025",
    textTransform: "capitalize",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
});
