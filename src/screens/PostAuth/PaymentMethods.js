import React from 'react';
import { View, Alert, ScrollView, Image, Text,StyleSheet,SafeAreaView } from 'react-native';
import { BLACK } from '../../global/colors';

function PaymentMethods(props) {
   return (
      <SafeAreaView >
         <View style={styles.containerPaymentMethods}>
         <Text style={styles.textHeading}>Payment Methods</Text>
         </View>
         <View>
            <Text style={styles.paymentText}>We only prefer online payments.</Text>
         </View>
      </SafeAreaView>
      
      
   );
}

const styles = StyleSheet.create({
   containerPaymentMethods:{
      marginTop:60, 
      fontSize:25,
      backgroundColor:'orange',
      padding:20,
   },
   textHeading:{
      color:"white",
      fontSize:22,
      fontWeight:"semi-bold"
   },
   paymentText:{
      padding:20,
      fontSize:17,
      color:'orange'
   }
})

export default PaymentMethods;