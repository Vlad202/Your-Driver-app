import { StyleSheet, Text, View } from "react-native";

const styles = {
  Main: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  Logo: {
    color: 'white',
    fontSize: 54,
    fontFamily: 'SatisfyRegular',
    paddingTop: 30,
  },
  Btn: {
    color: '#222',
  },
  PriceText: {
    color: 'white',
  },
  OrderView: {
    width: '100%',
    alignItems: 'center',
  },
  HelpTextView: {
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
  },
  PhoneNumbers: {
    marginTop: '10%',
  },
  MainLogin: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputsView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 40,
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
    backgroundColor: '#222',
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
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  appButtonContainerDisable: {
    elevation: 8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
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
    paddingTop: 20,
    color: 'white',
    fontWeight: "bold",
    fontSize: 18,
  },
  tarifs: {
    paddingTop: 5,
    color: 'white',
  }
}
export default styles;