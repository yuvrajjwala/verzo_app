import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Image,
} from "react-native";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar";
import { Colors } from "../../global";
import BackArrowIcon from "../../assets/back.svg";
import { useFocusEffect } from "@react-navigation/native";
import { retrieveData } from "../../utils/Storage";
import { GETCALL, POSTCALL } from "../../global/server";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const UserItem = ({ user, order_id, closeModal }) => {
  const bookDeliveryBoy = async () => {
    let payload = {
      orderId: order_id,
      assignedTo: user._id,
      bookingStatus: "pending",
    };
    console.log("working");
    let response = await POSTCALL("api/delivery/create-delivery", payload);
    console.log("working 1");
    if (response.responseData.success) {
      closeModal();
    }
  };
  return (
    <TouchableOpacity
      style={{
        padding: 10,
        borderRadius: 5,
      }}
      onPress={() => {
        bookDeliveryBoy();
      }}
    >
      <View style={styles.userItem}>
        <Image
          source={{
            uri: "https://st5.depositphotos.com/1915171/64699/v/450/depositphotos_646996546-stock-illustration-user-profile-icon-avatar-person.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DeliveryModal = ({ allUsers, order_id, openModal, closeModal }) => {
  return (
    <>
      {/* delivery Modal  */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={true}
        onRequestClose={closeModal}
      >
        <View
          style={{
            border: 2,
            borderColor: "red",
            flex: 1,
            marginTop: 42,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              width: "90%",
              marginLeft: 20,
            }}
          >
            <TouchableOpacity onPress={closeModal}>
              <FontAwesome name="times" size={24} color="#f57d7d" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 8 }}>
            <ScrollView
              style={{
                borderWidth: 1,
                borderColor: "#615b5b",
                width: "90%",
                marginLeft: 20,
                borderRadius: 12,
                marginBottom: 15,
              }}
            >
              {allUsers?.map((item, index) => (
                <UserItem
                  key={index}
                  user={item}
                  order_id={order_id}
                  closeModal={closeModal}
                />
              ))}
            </ScrollView>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
      </Modal>
    </>
  );
};

export default DeliveryModal;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F7F6F9",
    flex: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#615b5b",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userList: {
    flex: 1,
  },
});
