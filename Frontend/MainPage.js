import React from 'react';
import { StyleSheet, Text,Alert, TextInput, FlatList,Modal, KeyboardAvoidingView, TouchableOpacity,Dimensions, View,LayoutAnimation, Platform, NativeModules} from 'react-native';
import Colors from './Colors';
import {Constants, Font} from 'expo';
import {Ionicons,SimpleLineIcons,FontAwesome,Entypo,MaterialIcons,MaterialCommunityIcons,Feather} from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

const { UIManager } = NativeModules;

console.disableYellowBox = true;

export default class MainPage extends React.Component {
    constructor(props){
        super(props)

        if (Platform.OS === "android") {UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);}

        this.state = {

            listMode: 0, // 0 => univesityName, 1=> areas, 2=> courses
            isSelectAll: false,
            isSelectAllAreas: false,
            universityArray: [],
            isUniversitySelectedArray: [],
            selectedUniversities: [],

            areasArray: [],
            isSelectedAreasArray: [],
            selectedAreas: [],

            coursesArray: [],
            isAdmin: this.props.navigation.state.params.isAdmin,
            showAddUni: false,
            showCourseModal: false,

            newUniName: "",
            newUniCountry: "",
            cid: null,
            uniid: null,
            ecid: null,
            name: null,
            ename: null,
            credit: null,
            ectscredit: null,
            area: null,

            selectedCourse: null,
            isCourseEdit: false,
          }
    }

    componentDidMount(){
      LayoutAnimation.easeInEaseOut();

      this.getAllUniversities();
    }

    getAllUniversities() {
        LayoutAnimation.easeInEaseOut();

        fetch("http://localhost/306/api/v1/getUniNames")
        .then((response) => response.json())
        .then((responseJson) => {

          let isUniversitySelectedArray = [];
          for (let index = 0; index < responseJson.length; index++) {
            isUniversitySelectedArray.push(false)
          }
          this.setState({universityArray: responseJson, isUniversitySelectedArray: isUniversitySelectedArray});

        })
        .catch((error) => {
          Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])
        })

    }

    seperatorComponent() {

      let comp = (<View style={{alignSelf: 'center', width: '85%',height: 1, backgroundColor: 'rgba(255,255,255,0.5)' }}/>)
      return this.state.listMode == 2 ? null : comp;
    }

    listEmptyComp() {
      LayoutAnimation.easeInEaseOut();

      let comp = (
        <View style={{marginTop: 60}}>
          <Text style={{fontSize: 18, fontWeight: '500',color: Colors.bw14, textAlign: 'center'}}>Please wait...</Text>
        </View>
      )
      return comp;
    }


    queryAreas(){
      LayoutAnimation.easeInEaseOut();

      let flag = false;
      for (let index = 0; index < this.state.isUniversitySelectedArray.length; index++) {

        if(this.state.isUniversitySelectedArray[index]){
          flag = true
        }
      }

      if(flag){

        fetch("http://localhost/306/api/v1/getAreas").then((response) => response.json())
        .then((responseJson) => {

          let isSelectedAreasArray = [];
          for (let index = 0; index < responseJson.length; index++) {
            isSelectedAreasArray.push(false)
          }
          this.setState({areasArray: responseJson,isSelectedAreasArray: isSelectedAreasArray, listMode: 1})

        }).catch((error) => {
          Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])

        })

      }else{
        Alert.alert('No Selected University',"Please select at least one university.",[{text: 'OK', onPress: () => console.log('OK Pressed')}])
      }

    }


    renderRows(item, index) {
      LayoutAnimation.easeInEaseOut();

      let row = (
        <TouchableOpacity onPress={() => {this.state.listMode == 0 ? this.universitySelected(index) : this.areaSelected(index)}} style={styles.rowButton}>
          <View style={{justifyContent: 'center',alignItems: 'center'}}>
            <Text style={styles.rowUniName}>
              {this.state.listMode == 0 ? item.name : item.area}
            </Text>
            {this.state.listMode == 0 ?
            <Text style={styles.uniCountry}>
            {item.country}
          </Text> : undefined}

          </View>
          {this.state.listMode == 0 ?
          (this.state.isUniversitySelectedArray[index] ?
            <Feather style={{position: 'absolute', right: 46, top: 17}} name={"check-circle"} size={24} color={Colors.bw14}/>
            :
          undefined)

        :
        (this.state.isSelectedAreasArray[index] ?
          <Feather style={{position: 'absolute', right: 46, top: 17}} name={"check-circle"} size={24} color={Colors.bw14}/>
          :
        undefined)

        }



        </TouchableOpacity>
      )
      return row;
    }

    renderCourses(item, index) {

      let comp = (
        <TouchableOpacity
          onPress={() =>
            {this.setState({
              selectedCourse: item,
              isCourseEdit: true,
              showCourseModal: true,
              cid: item.cid,
              uniid: item.uniid,
              ecid: item.ecid,
              name: item.name,
              ename: item.ename,
              credit: item.credit,
              ectscredit: item.ectscredit,
              area: item.area,
            })}}
          disabled={this.state.isAdmin == "admin" ? false : true}
          style={styles.courseContainer}>
          <Text style={{fontSize: 15, fontWeight: '700',color: Colors.bw5}}>
            {item.cid + " - " + item.name}
          </Text>

          <View style={{height: 1, backgroundColor: Colors.bw10, marginVertical: 6, alignSelf: 'center', width: '100%'}}/>

          <Text style={{fontSize: 15, fontWeight: '700',color: Colors.bw5}}>
            {item.ecid + " - " + item.ename}
          </Text>

          <View style={{height: 1, backgroundColor: Colors.bw10, marginVertical: 6, alignSelf: 'center', width: '100%'}}/>

          <Text style={{fontSize: 14, fontWeight: '500',color: Colors.bw5}}>
            {"Credit: " + item.credit + "  ECTS: " + item.ectscredit + "  Area: " + item.area}
          </Text>
        </TouchableOpacity>
      )

      return comp;
    }

    universitySelected(index) {
      LayoutAnimation.easeInEaseOut();

      let isSelectedArr = this.state.isUniversitySelectedArray;

      if(isSelectedArr[index]){
        isSelectedArr[index] = false;
      }else{
        isSelectedArr[index] = true;
      }

      this.setState({isUniversitySelectedArray: isSelectedArr});
    }

    areaSelected(index) {
      LayoutAnimation.easeInEaseOut();

      let isSelectedAreasArray = this.state.isSelectedAreasArray;

      if(isSelectedAreasArray[index]){
        isSelectedAreasArray[index] = false;
      }else{
        isSelectedAreasArray[index] = true;
      }

      this.setState({isSelectedAreasArray: isSelectedAreasArray});
    }

    selectAll() {
      LayoutAnimation.easeInEaseOut();

      if(this.state.listMode == 0){

        for (let index = 0; index < this.state.isUniversitySelectedArray.length; index++) {
          this.state.isUniversitySelectedArray[index] = this.state.isSelectAll ? false : true;
        }
        this.setState({isSelectAll: !this.state.isSelectAll})

      }else{
        for (let index = 0; index < this.state.isSelectedAreasArray.length; index++) {

          this.state.isSelectedAreasArray[index] = this.state.isSelectAllAreas ? false : true;
        }

        this.setState({isSelectAllAreas: !this.state.isSelectAllAreas})
      }

    }

    queryCourses(){
      LayoutAnimation.easeInEaseOut();

      let flag = false;
      for (let index = 0; index < this.state.isSelectedAreasArray.length; index++) {

        if(this.state.isSelectedAreasArray[index]){
          flag = true
        }
      }

      if(flag){

        let universityString = "";
        let areasString = "";

        for (let index = 0; index < this.state.isUniversitySelectedArray.length; index++) {
          if(this.state.isUniversitySelectedArray[index]){
            universityString = universityString + this.state.universityArray[index].name + ","
          }
        }

        for (let index = 0; index < this.state.isSelectedAreasArray.length; index++) {
          if(this.state.isSelectedAreasArray[index]){
            areasString = areasString + this.state.areasArray[index].area + ","
          }
        }


        universityString = universityString.slice(0,universityString.length - 1);
        areasString = areasString.slice(0,areasString.length - 1);


        let finalUrl = "http://localhost/306/api/v1/atest?anames=" + areasString + "&unames=" + universityString
        fetch(finalUrl).then((response) => response.json())
        .then((responseJson) => {

          let finalArr = [];

        for (let index = 0; index < 50; index++) {
          if(responseJson[index]){
            finalArr.push(responseJson[index])
          }
        }

          this.setState({listMode: 2, coursesArray: finalArr})
          console.log(finalArr)

        }).catch((error) => {
          Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])

        })

      }else{
        Alert.alert('No Selected Area',"Please select at least one area.",[{text: 'OK', onPress: () => console.log('OK Pressed')}])
      }
    }


    addUniversityQuery(){

      if(this.state.newUniCountry.length == 0){
        Alert.alert('Empty Country',"Please enter valid country.",[{text: 'OK', onPress: () => console.log('OK Pressed')}])

      }else if(this.state.newUniName == 0){
        Alert.alert('Empty Name',"Please enter valid university name.",[{text: 'OK', onPress: () => console.log('OK Pressed')}])

      }else {

        let url = "http://localhost/306/api/v1/insertUni?name="+ this.state.newUniName +"&country=" + this.state.newUniCountry

        fetch(url).then((response) => response.json())
        .then((responseJson) => {

          Alert.alert('Success',this.state.newUniName + "successfully added!",[{text: 'OK', onPress: () => console.log('OK Pressed')}])
          this.getAllUniversities();
          this.setState({showAddUni: false})

        }).catch((error) => {
          Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])

        })
      }

    }

    addUniversityModal(){
      let comp = (
        <View style={styles.container}>
          <Text style={styles.headerText}>
          Add New University
        </Text>

        <TextInput
          blurOnSubmit={true}
          style={styles.InputText}
          autoCorrect={false}
          placeholder={"university Name"}
          autoCapitalize={"none"}
          underlineColorAndroid={"transparent"}
          returnKeyType={"next"}
          onSubmitEditing={() =>  this.refs.a.focus()}
          onChangeText={text => this.setState({newUniName: text})}
        />

        <TextInput
          blurOnSubmit={true}
          ref={"a"}
          style={styles.InputText}
          placeholder={"University Country"}
          underlineColorAndroid={"transparent"}
          returnKeyType={"done"}
          onSubmitEditing={() =>  this.addUniversityQuery()}
          onChangeText={text => this.setState({newUniCountry: text})}
        />

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.setState({showAddUni: false})} style={{backgroundColor: Colors.bw14,marginHorizontal: 5, marginTop: 12, width: 80,height: 36, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.bw13}}>
            <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', color: Colors.bw5}}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.addUniversityQuery()} style={{backgroundColor: Colors.bw14, marginTop: 12,marginHorizontal: 5, width: 80,height: 36, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.bw13}}>
            <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', color: Colors.bw5}}>
              Send
            </Text>
          </TouchableOpacity>
        </View>


        </View>
      )
      return comp;
    }

    addCourseQuery(){

      if(
        this.state.cid.length == 0 ||
        this.state.uniid.length == 0 ||
        this.state.ecid.length == 0 ||
        this.state.name.length == 0 ||
        this.state.ename.length == 0 ||
        this.state.credit.length == 0 ||
        this.state.ectscredit.length == 0 ||
        this.state.area.length == 0 ){
        Alert.alert('Empty Input',"Some input(s) are empty. Please be sure all inputs are entered..",[{text: 'Ok honey.', onPress: () => console.log('OK Pressed')}])

      }else {

        let url = "http://localhost/306/api/v1/insertCourse?cid=" + this.state.cid + "&uniid=" + this.state.uniid + "&ecid=" + this.state.ecid + "&name=" +  this.state.name + "&ename=" + this.state.ename + "&credit=" + this.state.credit + "&ectscredit=" + this.state.ectscredit + "&area=" + this.state.area
        fetch(url).then((response) => response.json())
        .then((responseJson) => {

          Alert.alert('Success'," New Course is successfully added!",[{text: 'OK', onPress: () => console.log('OK Pressed')}])
          this.queryCourses();
          this.setState({showCourseModal: false})

        }).catch((error) => {
          Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])

        })
      }
    }

    addCoursesModal(){

      let comp = (
        <KeyboardAvoidingView  behavior="padding" enabled style={styles.container}>
          <ScrollView>
            <Text style={styles.headerText}>
              {this.state.isCourseEdit ? "Edit Course" : "Add New Course"}
            </Text>

            <TextInput
              blurOnSubmit={true}
              style={styles.InputText}
              autoCorrect={false}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.cid : ""}
              placeholder={"cid"}
              autoCapitalize={"none"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"next"}
              onSubmitEditing={() =>  this.refs.a.focus()}
              onChangeText={text => this.setState({cid: text})}
            />

            <TextInput
              blurOnSubmit={true}
              ref={"a"}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.uniid : ""}
              style={styles.InputText}
              placeholder={"uniid"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"next"}
              onSubmitEditing={() =>  this.refs.b.focus()}
              onChangeText={text => this.setState({uniid: text})}
            />

            <TextInput
              blurOnSubmit={true}
              ref={"b"}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.ecid : ""}
              style={styles.InputText}
              placeholder={"ecid"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"next"}
              onSubmitEditing={() =>  this.refs.c.focus()}
              onChangeText={text => this.setState({ecid: text})}
            />

            <TextInput
              blurOnSubmit={true}
              ref={"c"}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.name : ""}
              style={styles.InputText}
              placeholder={"name"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"next"}
              onSubmitEditing={() =>  this.refs.d.focus()}
              onChangeText={text => this.setState({name: text})}
            />

            <TextInput
              blurOnSubmit={true}
              ref={"d"}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.ename : ""}
              style={styles.InputText}
              placeholder={"ename"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"next"}
              onSubmitEditing={() =>  this.refs.e.focus()}
              onChangeText={text => this.setState({ename: text})}
            />


            <TextInput
              blurOnSubmit={true}
              ref={"e"}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.credit : ""}
              style={styles.InputText}
              placeholder={"credit"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"next"}
              onSubmitEditing={() =>  this.refs.f.focus()}
              onChangeText={text => this.setState({credit: text})}
            />

            <TextInput
              blurOnSubmit={true}
              ref={"f"}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.ectscredit : ""}
              style={styles.InputText}
              placeholder={"ECTS"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"next"}
              onSubmitEditing={() =>  this.refs.g.focus()}
              onChangeText={text => this.setState({ectscredit: text})}
            />

            <TextInput
              blurOnSubmit={true}
              ref={"g"}
              defaultValue={this.state.isCourseEdit ? this.state.selectedCourse.area : ""}
              style={styles.InputText}
              placeholder={"area"}
              underlineColorAndroid={"transparent"}
              returnKeyType={"done"}
              onSubmitEditing={() =>  this.addCourseQuery()}
              onChangeText={text => this.setState({area: text})}
            />

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => this.setState({showCourseModal: false, isCourseEdit: false})} style={{backgroundColor: Colors.bw14,marginHorizontal: 5, marginTop: 12, width: 80,height: 36, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.bw13}}>
                <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', color: Colors.bw5}}>
                  Back
                </Text>
              </TouchableOpacity>

              {this.state.isCourseEdit ?
              <TouchableOpacity onPress={() => this.deleteCourse(true)} style={{backgroundColor: Colors.bw14, marginTop: 12,marginHorizontal: 5, width: 80,height: 36, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.bw13}}>
              <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', color: Colors.bw5}}>
                Delete
              </Text>
            </TouchableOpacity>
            : undefined}

              <TouchableOpacity onPress={() => this.state.isCourseEdit ? this.deleteCourse(false) : this.addCourseQuery()} style={{backgroundColor: Colors.bw14, marginTop: 12,marginHorizontal: 5, width: 80,height: 36, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.bw13}}>
                <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', color: Colors.bw5}}>
                  {this.state.isCourseEdit ? "Edit" : "Send"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </KeyboardAvoidingView>
      )
      return comp;
    }

    deleteCourse(isOnlyDelete){

      if(isOnlyDelete){
        //delete
        let url = "http://localhost/306/api/v1/deleteCourse?cid=" + this.state.selectedCourse.cid + "&uniid=" + this.state.selectedCourse.uniid
        fetch(url).then((response) => response.json())
        .then((responseJson) => {

          Alert.alert('Success'," Deleted!",[{text: 'OK', onPress: () => console.log('OK Pressed')}])
          this.queryCourses();
          this.setState({showCourseModal: false, isCourseEdit: false})

        }).catch((error) => {
          Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])

        })
      }else {
        //update
          let url = "http://localhost/306/api/v1/deleteCourse?cid=" + this.state.selectedCourse.cid + "&uniid=" + this.state.selectedCourse.uniid
          fetch(url).then((response) => response.json())
          .then((responseJson) => {

            let url = "http://localhost/306/api/v1/insertCourse?cid=" + this.state.cid + "&uniid=" + this.state.uniid + "&ecid=" + this.state.ecid + "&name=" +  this.state.selectedCourse.name + "&ename=" + this.state.ename + "&credit=" + this.state.credit + "&ectscredit=" + this.state.ectscredit + "&area=" + this.state.area
            fetch(url).then((response) => response.json())
            .then((responseJson) => {

              Alert.alert('Success',"Successfully edited.",[{text: 'OK', onPress: () => console.log('OK Pressed')}])
              this.queryCourses();
              this.setState({showCourseModal: false, isCourseEdit: false})

            }).catch((error) => {
              Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])

            })

        }).catch((error) => {
          Alert.alert('Error',error.message,[{text: 'OK', onPress: () => console.log('OK Pressed')}])

        })
      }

    }

    render() {

      LayoutAnimation.easeInEaseOut();

      return (
        <View style={styles.container}>

          <Text style={styles.headerText}>
            {this.state.listMode == 0 ? "Please Select Your Universities" : this.state.listMode == 1 ? "Please Select Area(s)" : "Courses"}
          </Text>

          <View style={{flexDirection: 'row',justifyContent:'center', width: '100%'}}>
            {this.state.listMode == 2 ? undefined :
              <TouchableOpacity onPress={() => this.selectAll()} style={[styles.nextButton,{width: '40%',paddingHorizontal: 3,paddingVertical: 5,marginBottom: 8}]}>
                <Text style={styles.nextText}>
                  {this.state.listMode == 0 ? this.state.isSelectAll ? "Check None" : "Check All" : this.state.isSelectAllAreas ? "Check None" : "Check All"}
                </Text>
              </TouchableOpacity>
            }

            {this.state.listMode == 0 && this.state.isAdmin == "admin" ?
              <Feather onPress={() =>  this.setState({showAddUni: true})} name={"plus-circle"} style={{position: 'absolute', right: 16}}size={28} color={Colors.bw14}/>
              : undefined}

            {this.state.listMode == 2 && this.state.isAdmin == "admin" ?
              <Feather onPress={() =>  this.setState({showCourseModal: true})} name={"plus-circle"} style={{position: 'absolute', top: -46,right: 16}}size={28} color={Colors.bw14}/>
              : undefined}

          </View>


          <View style={styles.thinView}/>

          <FlatList
            ref="uniList"
            ListEmptyComponent={() => this.listEmptyComp()}
            ItemSeparatorComponent={() => this.seperatorComponent()}
            data={this.state.listMode == 0 ? this.state.universityArray : this.state.listMode == 1 ? this.state.areasArray : this.state.coursesArray  }
            renderItem={({item, index}) => this.state.listMode == 2 ? this.renderCourses(item, index) : this.renderRows(item, index)}
        />

        <View style={styles.thinView}/>

        <View style={{flexDirection: 'row', marginVertical: 16}}>

          {this.state.listMode == 0 ? undefined :
          <TouchableOpacity onPress={() =>  this.setState({isSelectAllAreas: this.state.listMode == 1 ? false : this.state.listMode, listMode: this.state.listMode == 0 ? undefined : this.state.listMode == 1 ? 0 : 1})} style={styles.nextButton}>
            <Text style={styles.nextText}>
              Back
            </Text>
          </TouchableOpacity>
          }
          {this.state.listMode == 2 ? undefined :
          <TouchableOpacity onPress={() => {this.state.listMode == 0 ? this.queryAreas() : this.queryCourses() }} style={styles.nextButton}>
            <Text style={styles.nextText}>
              Next
            </Text>
          </TouchableOpacity>}
        </View>


        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.showAddUni}
          >
          {this.addUniversityModal()}
        </Modal>

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.showCourseModal}
          >
          {this.addCoursesModal()}
        </Modal>

        </View>
      );
    }
  }


  const styles = {
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      backgroundColor: Colors.bl3
    },
    InputText: {
      width: Dimensions.get('window').width * 0.8,
      height: 36,
      backgroundColor: Colors.bw13,
      borderWidth: 0.8,
      borderColor: Colors.bw10,
      borderRadius: 10,
      marginTop:8,
      fontSize: 16,
      fontWeight: '400',
      color: Colors.bw5,
      paddingHorizontal:8
    },
    headerText: {
      marginTop: Constants.statusBarHeight + 16,
      fontSize: 28,
      marginBottom: 16,
      fontWeight: '800',
      color: Colors.bw14,
      textAlign: 'center',
      width: '100%',
      backgroundColor: 'transparent'
    },
    rowButton:{
      alignItems: 'space-between',
      flexDirection: 'row',
      width: Dimensions.get("window").width,
      justifyContent: 'center',
      alignItems: 'center',
      height: 58
    },
    rowUniName:{
      fontSize: 18,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.9)'
    },
    uniCountry:{
      fontSize: 14,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.6)'
    },
    thinView:{
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.6)',
      width:'100%'
    },
    nextButton: {
      marginHorizontal: 8,
      width: '42%',
      paddingHorizontal: 6,
      paddingVertical: 8,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.7)',
      borderRadius: 12,
      justifyContent:'center',
      alignItems:'center'
    },
    nextText: {
      fontSize: 17,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.9)'
    },

    //courses styeles
    courseContainer:{
      alignSelf:'center',
      width: Dimensions.get("window").width - 24,
      borderColor: 'rgba(255,255,255,0.6)',
      borderWidth: 2,
      borderRadius: 10,
      padding: 7,
      backgroundColor: 'rgba(255,255,255,0.7)',
      marginVertical: 6
    },
    cardHeader: {

    },
    cardSubText: {

    }
  }
