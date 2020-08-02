import { StyleSheet, Text, View } from "react-native";
import { Dimensions } from 'react-native';
import * as Font from 'expo-font';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Math.round(Dimensions.get('window').height);
console.log(windowHeight)

let main_style = {
  flex: 1,
  backgroundColor: '#000',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: windowHeight,
}

let main_review_style = {
  flex: 1,
  backgroundColor: '#000',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: windowHeight,
}

if (windowHeight < 760) {
  main_review_style = {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: windowHeight,
  }
  main_style = {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
} else {
  main_review_style = {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
  main_style = {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
    // height: windowHeight,
  }
}

const styles = {
  Scroll: {
    flex: 1,
    height: windowHeight
  },
  Main: main_style,
  iconWait: {
    width: 20,
    height: 20,
    marginLeft: 10
  },
  MainReview: main_review_style,
  MainSearch: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: windowHeight,
  },
  Logo: {
    color: 'white',
    fontSize: 54,
    fontFamily: 'SatisfyRegular',
    paddingTop: 30,
  },
  Btn: {
    color: '#000',
  },
  PriceText: {
    color: 'white',
    fontFamily: 'serif',
  },
  PriceTextStatic: {
    color: 'white',
    fontFamily: 'serif',
    fontSize: 8
  },
  TextErrHelp: {
    fontFamily: 'serif',
    fontSize: 11,
    color: 'white',
  },
  OrderView: {
    width: '100%',
    alignItems: 'center',
  },
  HelpTextView: {
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HelpText: {
    fontSize: 14,
    color: 'white',
  },
  Phones: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  PhoneNumbers: {
    marginTop: '10%',
    marginRight: '0%'
  },
  MainLogin: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
    // height: windowHeight,
  },
  inputsView: {
    marginTop: "10%",
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginTop: "5%",
    marginBottom: "10%",
    color: 'white',
    borderBottomColor: '#4c8bf5',
    borderBottomWidth: 1,
    width: '60%',
    fontSize: 14,
  },
  btnLog: {
    width: '60%',
  },
  authRoutes: {
    flexDirection: 'row',
  },
  routesTexts: {
    color: 'white',
    paddingLeft: 30,
    paddingRight: 30,
  },
  MainSms: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  SmsInp: {
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
    // marginTop: '40%',
  },
  LogoSms: {
    // marginTop: '15%',
    color: 'white',
    fontSize: 54,
    fontFamily: 'SatisfyRegular',
    paddingTop: 60,
  },
  countdown: {
    // marginTop: '20%',
  },
  appButtonContainer: {
    fontFamily: 'serif',
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  TextAreaView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '8%',
  },
  textArea: {
    height: 30,
    color: 'white',
    borderBottomColor: '#4c8bf5',
    borderBottomWidth: 1,
    width: 260,
    fontSize: 14,
  },
  appButtonContainerDisable: {
    fontFamily: 'serif',
    elevation: 8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  orderBtns: {
    marginTop: '-7%'
  },
  appButtonText: {
    fontFamily: 'serif',
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  appButtonTextFullDay: {
    fontFamily: 'serif',
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  MessageTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    marginBottom: '3%',
  },
  EditAddrText: {
    borderWidth: 2,
    borderBottomColor: '#ffac55',
    fontFamily: 'serif',
    fontSize: 15,
    color: "#ffac33",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    marginBottom: '3%',
  },
  containerLoad: {
    flex: 1,
    justifyContent: "center"
  },
  lineStyle: {
    borderWidth: 1.5,
    borderColor:'white',
    marginLeft: "-50%",
    width: '200%',
    // marginTop: 10,
    marginBottom: 15,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  appButtonCheckText: {
    fontSize: 18,
    paddingBottom: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  linkSite: {
    fontFamily: 'serif',  
    paddingTop: 20,
    color: 'white',
    fontWeight: "bold",
    fontSize: 18,
  },
  linkApp: {
    fontFamily: 'serif',  
    paddingTop: 20,
    color: '#3d63db',
    fontWeight: "bold",
    fontSize: 18,
  },
  helloText: {
    fontFamily: 'serif',  
    paddingTop: 20,
    color: 'white',
    fontWeight: "bold",
    fontSize: 14,
  },
  tarifs: {
    paddingTop: 5,
    color: 'white',
  }
}
export default styles;