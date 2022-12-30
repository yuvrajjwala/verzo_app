import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, KeyboardAvoidingView, Image, Alert } from 'react-native'
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { Colors } from '../../global';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../state/reducers/CartReducer';
import CustomButton from '../../components/CustomButton';
import CheckBox from '../../components/CheckBox';
import BackArrowIcon from '../../assets/back.svg';
import { showMessage } from 'react-native-flash-message';
import { POSTCALL } from '../../global/server';
import { retrieveData } from '../../utils/Storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { setSelectedDryCleaner } from '../../state/reducers/DrycleanerReducer';

const Cart = ({ navigation }) => {

    const { cartList } = useSelector((state) => state.cartReducer);
    const { selectedDryCleaner } = useSelector((state) => state.drycleanerreducer);
    const dispatch = useDispatch();
    const [loader, setLoader] = React.useState(false);

    console.log(JSON.stringify(selectedDryCleaner,null,4));
    
    const increment = (item) => {
        let temp = JSON.parse(JSON.stringify(cartList));
        let index = temp.findIndex((single, index) => single.itemName == item.itemName);
        if (index != -1) {
            temp[index].count += 1;
            dispatch(setCart(temp))
        }
    }

    const decrement = (item) => {
        let temp = JSON.parse(JSON.stringify(cartList));
        let index = temp.findIndex((single, index) => single.itemName == item.itemName);
        if (index != -1 && temp[index].count > 1) {
            temp[index].count -= 1;
            dispatch(setCart(temp))
        }
    }

    const deleteCartItem = (item) => {
        let temp = JSON.parse(JSON.stringify(cartList));;
        temp = temp.filter((single, index) => single.itemName != item.itemName);
        dispatch(setCart(temp))
    }


    const openPrompt = (item) => {
        Alert.alert(
            "Remove From Cart?",
            "",
            [
                {
                    text: "Remove",
                    onPress: () => {
                        deleteCartItem(item)
                    },
                    style: "default"
                },
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: 'cancel'
                }
            ]
        );
    }

    const toggleAttribute = (itemName, attributeIndex) => {
        let temp = JSON.parse(JSON.stringify(cartList));
        let index = temp.findIndex((single, index) => single.itemName == itemName);
        let selectedLength = temp[index].attributes.filter((single, index) => single.status == true).length;
        if (selectedLength == 1 && temp[index].attributes[attributeIndex].status == true) {
            showMessage({
                message: "One attribute should be selected!",
                type: 'danger',
                style: {
                    alignItems: 'center'
                },
                autoHide: true,
                duration: 1500
            });
        } else {
            temp[index].attributes[attributeIndex].status = !temp[index].attributes[attributeIndex].status;
            dispatch(setCart(temp))
        }

    }

    React.useEffect(() => {
        calculateTotalPrice();
    }, [cartList])

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        let temp = JSON.parse(JSON.stringify(cartList));
        temp.forEach((cartItem, index) => {
            let singlePrice = 0;
            cartItem.attributes.forEach((attribute, index) => {
                if (attribute.status) {
                    singlePrice += parseFloat(attribute.price)
                }
            });
            totalPrice += (singlePrice * cartItem.count)
        })
        return totalPrice;
    }

    const calculateIndividualPrice = (item) => {
        let singlePrice = 0;
        item.attributes.forEach((attribute, index) => {
            if (attribute.status) {
                singlePrice += parseFloat(attribute.price)
            }
        });
        return singlePrice;
    }

    const renderItems = ({ item, cartIndex }) => {

        return (
            <View
                style={{
                    margin: 15,
                    borderRadius: 5,
                    overflow: 'hidden',
                    backgroundColor: Colors.WHITE,
                    padding: 10,
                    ...styles.shadow
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '60%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: Colors.BLACK, fontSize: 18, textTransform: 'capitalize' }}>
                                {item.itemName}
                            </Text>
                            <Text style={{ color: "#F99025", fontSize: 18, textTransform: 'capitalize' }}>
                                ${calculateIndividualPrice(JSON.parse(JSON.stringify(item)))}
                            </Text>
                        </View>
                        <View style={{ height: 20 }} />
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                            {item.attributes.map((attribute, attributeIndex) => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10 }} key={attributeIndex}>
                                        <CheckBox
                                            label={attribute.name}
                                            selected={attribute.status}
                                            onPress={() => {
                                                toggleAttribute(item.itemName, attributeIndex)
                                            }}
                                        />
                                        <View style={{width:20}} />
                                        <Text style={{fontWeight:'400',fontSize:16,color:"#000"}}>Price : {attribute.price}</Text>
                                    </View>
                                )
                            })}
                        </View>

                    </View>
                    <View style={{ width: '40%', alignItems: 'flex-end' }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{
                                height: 100,
                                width: 50,
                                backgroundColor: Colors.WHITE,
                                ...styles.shadow,
                                borderRadius: 10,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 5
                            }}>
                                <TouchableOpacity
                                    onPress={() => increment(item)}
                                >
                                    <Image
                                        source={require('../../assets/plus.png')}
                                        style={{ width: 15, height: 15, resizeMode: 'contain' }}
                                    />
                                </TouchableOpacity>

                                <Text style={{ color: Colors.BLACK, fontSize: 18, textTransform: 'capitalize' }}>
                                    {item.count}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => decrement(item)}
                                >
                                    <Image
                                        source={require('../../assets/minus.png')}
                                        style={{ width: 15, height: 15, resizeMode: 'contain' }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 20 }} />
                            <TouchableOpacity
                                onPress={() => openPrompt(item)}
                                style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    backgroundColor: "#F99025",
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Image source={require('../../assets/trash.png')} style={{ tintColor: Colors.WHITE, width: 15, height: 15, resizeMode: 'contain' }} />
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </View>
        )
    }

    const bookOrder = async () => {
        let data = await retrieveData('userdetails');
        let order = {};
        let bookingItems = [];
        order.dryCleanerId = selectedDryCleaner.userId;
        let tempCartList = JSON.parse(JSON.stringify(cartList));
        
        tempCartList.forEach((single, index) => {
            let obj = {};
            obj.itemName = single.itemName;
            obj.itemQuantity = single.count;
            obj.itemPrice = 0;
            obj.itemAttributes = {};
            single.attributes.forEach((attribute, index) => {
                if (attribute.status) {
                    obj.itemAttributes[attribute.name] = 'yes';
                    obj.itemPrice += parseInt(attribute.price)
                }
            })
            bookingItems.push(obj);
        })
        order.bookingItems = bookingItems;
        order.totalPrice = calculateTotalPrice();
        setLoader(true);
        console.log("Payload:-",JSON.stringify(order, null, 4))
        if (data && data.token) {
            let resposne = await POSTCALL('booking/dry-cleaner', order, data.token);
            setLoader(false);
            console.log("resposne:-",JSON.stringify(resposne, null, 4))
            if (resposne.responseData.success == true) {
                dispatch(setCart([]));
                dispatch(setSelectedDryCleaner({}))
                showMessage({
                    message: resposne.responseData.msg,
                    type: 'success',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: true,
                    duration: 1500
                });
                navigation.navigate('UserMenu')
            }else{
                showMessage({
                    message: "Error while booking!",
                    type: 'warning',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: true,
                    duration: 1500
                });
            }
            
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#4C4C4C' }}>
            <FocusAwareStatusBar isLightBar={false} isTopSpace={true} />
            {/* <Spinner visible={loader} /> */}
            <View style={styles.screen}>
                <View style={{
                    backgroundColor: Colors.WHITE,
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    position: 'absolute',
                    zIndex: 9999,
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{}}
                            onPress={() => navigation.goBack()}>
                            <BackArrowIcon height={'30'} />
                        </TouchableOpacity>
                        <Text style={{ color: Colors.BLACK, fontSize: 22, marginVertical: 10, marginLeft: 15 }}>
                            Order Summary
                        </Text>
                    </View>

                    <Text style={{ color: Colors.BLACK, fontSize: 18, color: "#F99025", fontWeight: 'bold' }}>
                        Total: $ {(calculateTotalPrice())}
                    </Text>
                </View>

                <View style={{ minHeight: 200 }}>
                    <FlatList
                        data={cartList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItems}
                        contentContainerStyle={{
                            paddingBottom: 100,
                            paddingTop: 50
                        }}
                    />
                </View>
                <View style={{ position: 'absolute', zIndex: 999, width: '100%', bottom: 10 }}>
                    <CustomButton
                        buttonText={"Book order"}
                        onPress={bookOrder}
                        customStyle={{
                            backgroundColor: "#F99025",
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 50,
                            borderRadius: 25,
                            marginHorizontal: 16
                        }}
                        textStyle={{
                            color: Colors.WHITE,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}
                    />
                </View>

            </View>
        </KeyboardAvoidingView>
    )
}

export default Cart

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
    }
})