import React from 'react';
import { StyleSheet, Text, Alert, View, TextInput, Dimensions, TouchableOpacity, Image} from 'react-native';
import Colors from './Colors';
import { NavigationActions } from 'react-navigation';
import {Constants, Font, LinearGradient} from 'expo';


export default class LoginPage extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            email: "",
            password: ""
        }
    }


    loginQuery() {

        if(this.state.email.length == 0){
            Alert.alert('Email Empty','Please enter a valid email.',[{text: 'OK', onPress: () => console.log('OK Pressed')}])
        }else if (this.state.password.length == 0){
            Alert.alert('Password Empty','Please enter a valid password.',[{text: 'OK', onPress: () => console.log('OK Pressed')}])
        }else{
            //start query
            let url = "http://localhost/306/api/v1/login?email=" + this.state.email + "&password=" + this.state.password

            fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {

                if(responseJson.message == "There is no such user"){
                    Alert.alert('User','There is no such user.',[{text: 'OK', onPress: () => console.log('OK Pressed')}])

                }else if(responseJson.message == "Wrong credentials"){
                    Alert.alert('Wrong Credentials','Please check your credentials and try again.',[{text: 'OK', onPress: () => console.log('OK Pressed')}])

                }else{
                    //login
                    this.props.navigation.navigate('MainPage', {isAdmin: responseJson.isAdmin})
                }

            })
            .catch((error) => {

            })

        }


    }

    render() {
        return (
            <LinearGradient
                colors={[Colors.bl4,Colors.bl3]}
                start={{x: 0.0, y: 1.0}}
                end={{x: 1.0, y: 0.0}}
                style={styles.container}
            >
            <Image
                    source={require('./Sabanci_Universitesi-logo.png')}
                    style={styles.logo}
                    resizeMode= "contain"
                />
            <Text style={styles.header}>Sabanci University Outgiong System</Text>
            <View style={styles.thinView}/>
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Username</Text>
                    <TextInput
                        blurOnSubmit={true}
                        ref={ref=> this.newPostTitle = ref}
                        style={styles.InputText}
                        autoCorrect={false}
                        autoCapitalize={"none"}
                        underlineColorAndroid={"transparent"}
                        returnKeyType={"next"}
                        onSubmitEditing={() =>  this.refs.password.focus()}
                        onChangeText={text => this.setState({email: text})}
                    />

                    <Text style={[styles.titleText, {marginTop:18}]}>Password</Text>
                    <TextInput
                        blurOnSubmit={true}
                        ref={"password"}
                        style={styles.InputText}
                        secureTextEntry
                        autoCorrect={false}
                        autoCapitalize={"none"}
                        underlineColorAndroid={"transparent"}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) =>  this.loginQuery()}
                        onChangeText={text => this.setState({password: text})}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => this.loginQuery()}
                    style={styles.loginButton}>
                <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>

            </LinearGradient>
            );
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex:1,
        },
        logo: {
            width: 160 ,
            height: 60,
            alignSelf: 'center',
            marginTop: 30
        },
        header:{
            fontSize:23,
            fontWeight:'600',
            color: Colors.bw5,
            textAlign:'center',
            marginTop:10,
            paddingHorizontal: 10
        },
        thinView:{
            backgroundColor: Colors.bw10,
            height:0.8,
            width:Dimensions.get("window").width * 0.8,
            alignSelf: 'center',
            marginTop: 12
        },
        textContainer: {
            marginTop: 25,
            marginHorizontal:30
        },
        titleText: {
            fontSize: 19,
            fontWeight: '500',
            color: Colors.bw5
        },
        InputText: {
            width: Dimensions.get('window').width * 0.8,
            height: 30,
            backgroundColor: Colors.bw12,
            borderWidth: 0.8,
            borderColor: Colors.bw10,
            borderRadius: 10,
            marginTop:4,
            paddingHorizontal:8
        },
        loginButton: {
            marginTop:30,
            alignSelf:'center',
            borderWidth: 2,
            borderColor: Colors.su1,
            borderRadius: 12,
            padding:10
        },
        buttonText: {
            fontSize: 19,
            fontWeight:'500',
            color: Colors.su1,
            textAlign: 'center'
        },
    });
