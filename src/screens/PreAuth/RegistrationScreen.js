import { StyleSheet, Text, View, TouchableOpacity, Dimensions, KeyboardAvoidingView, Alert, ImageBackground, Image, Keyboard } from 'react-native'
import React, { useState } from 'react'
import BackArrowIcon from "../../assets/back.svg";
import { BASE_URL, POSTCALL } from '../../global/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Phone from '../../assets/svg/phone2.svg';
import Lock from '../../assets/svg/lock.svg';
import { useDispatch } from 'react-redux';
import { Colors } from '../../global';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import TextInputGlobal from '../../components/TextInputGlobal';
import { globalStyles } from '../../global/globalStyles';
import { showMessage, hideMessage } from "react-native-flash-message";

const { height, width } = Dimensions.get("window");

const RegistrationScreen = ({ navigation }) => {

    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const disPatch = useDispatch();


    const registrationHandler = async () => {
        Keyboard.dismiss();
        if (number !== "" && password !== "") {
            setError(false);
            setLoading(true);

            const params = {
                "phoneNumber": number,
                password
            }

            try {
                let response  = await POSTCALL('auth/signup', params);
                
                setError(false);
                setLoading(false);

                if(response.responseData.success==true){
                    showMessage({
                        message: response.responseData.msg,
                        description: "Please Login",
                        type: "success",
                    });
                    setTimeout(() => {
                        hideMessage();
                        navigation.navigate('Login');
                    }, 1000)
                }else if(response.responseData.success==false){
                    showMessage({
                        message: response.responseData.error,
                        description: "Please Login",
                        type: "danger",
                    });
                }else{
                    return false
                }
                
                
            } catch (error) {
                console.log(error);
                setError(false);
                setLoading(false);
                alert(error.message)
            }
        } else {
            Alert.alert("Please Fill All the Details");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.WHITE }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <FocusAwareStatusBar isLightBar={false} isTopSpace={true} />
            <View style={styles.screen}>
                <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
                    <ImageBackground
                        source={require('../../assets/Background.png')}
                        style={{ width: width, height: height, position: 'absolute' }}
                    />
                    <View style={{ padding: 20 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.goBack()}>
                            <BackArrowIcon height={'30'} />
                        </TouchableOpacity>
                        <Image
                            source={require('../../assets/Heading.png')}
                            style={{
                                height: 48,
                                width: 192,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                marginVertical: 50,
                            }}
                        />
                        <View style={{ marginTop: 30 }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: Colors.GRAY_DARK,
                                        marginBottom: 5,
                                    }}>
                                    Phone Number
                                </Text>
                                <TextInputGlobal
                                    Svg={<Phone />}
                                    placeHolder="Enter Number"
                                    setState={setNumber}
                                    state={number}
                                    keyboardType="phone-pad"
                                    maxLength={10}

                                />
                            </View>
                            <View style={{ marginBottom: 20 }}>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: Colors.GRAY_DARK,
                                        marginBottom: 5,
                                    }}>
                                    Password
                                </Text>
                                <TextInputGlobal
                                    Svg={<Lock />}
                                    placeHolder="Enter Password"
                                    setState={setPassword}
                                    state={password}
                                    secureTextEntry={true}
                                />

                            </View>

                            <TouchableOpacity
                                onPress={registrationHandler}
                                style={[
                                    globalStyles.button,
                                    { marginHorizontal: 10, marginVertical: 20 },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 15,
                                        fontWeight: '500',
                                        textAlign: 'center',
                                    }}>
                                    Register
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('Login')}
                                style={{
                                    marginVertical: 10
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.PRIMARY,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        alignSelf: 'center'
                                    }}>
                                    Already a user ? Signin
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </View>
        </KeyboardAvoidingView>
    )
}

export default RegistrationScreen

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#FFFFFF",
        flex: 1
    }
})