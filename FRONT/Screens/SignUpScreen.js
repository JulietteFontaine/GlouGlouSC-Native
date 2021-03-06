import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView, ScrollView, PixelRatio } from 'react-native';
import { Button, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import URL from '../URL'

function SignUpScreen({ navigation, onSubmitUserstatus, addToken }) {

  const [signUpUsername, setSignUpUsername] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpTel, setSignUpTel] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpStatus, setSignUpStatus] = useState('')

  const [isVisible, setIsVisible] = useState(false);

  const [listErrorsSignup, setlistErrorsSignup] = useState([])

  var tabErrorsSignup = listErrorsSignup.map((error, i) => {
    return (
      <View>
        <Text style={{ color: '#9D2A29', marginBottom: 10 }}>{error}</Text>
      </View>
    )
  })

  // POPUP CONFIRMATION INSCRIPTION
  if (isVisible) {
    return (

      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.text}>A BIENTÔT DANS LE</Text>
          <Image style={{ height: 100 * PixelRatio.getFontScale(), width: 100 * PixelRatio.getFontScale(), }} source={require('../assets/ContacterGlouGlou.png')}>
            {/* <Image style={{ width: "20%", height: "20%" }} source={require('../assets/ContacterGlouGlou.png')}> */}
          </Image>
          <Button
            containerStyle={{ marginBottom: 15, width: '20%', borderRadius: 15, }}
            title="OK"
            type="solid"
            buttonStyle={{ backgroundColor: '#FFAE34' }}
            onPress={() => {
              setIsVisible(false)
              navigation.navigate('SignIn');
            }}
          />
        </View>
      </View>
    )

    //   FORMULAIRE INSCRIPTION
  } else {
    return (

      <View style={{ flex: 1, backgroundColor: '#FBDF4C' }}>

        <View style={styles.container}>

          <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   >
            <ScrollView>
              <View style={styles.box}>

                <Image source={require('../assets/ContactGlouGlou.png')} style={{ margin: 10, width: 300, height: 300 }}></Image>

                <Input
                  containerStyle={{ marginBottom: 25, width: '70%' }}
                  inputStyle={{ marginLeft: 10 }}
                  placeholder='Nom'
                  leftIcon={
                    <Icon
                      name='user'
                      size={20}
                      color="#FFD15C"
                    />
                  }
                  onChangeText={(val) => setSignUpUsername(val)}
                />
                <Input
                  containerStyle={{ marginBottom: 25, width: '70%' }}
                  inputStyle={{ marginLeft: 10 }}
                  placeholder='Email'
                  leftIcon={
                    <Icon
                      name='inbox'
                      size={20}
                      color="#FFD15C"
                    />
                  }
                  onChangeText={(val) => {
                    setSignUpEmail(val);
                  }}
                />
                <Input
                  containerStyle={{ marginBottom: 25, width: '70%' }}
                  inputStyle={{ marginLeft: 10 }}
                  placeholder='Téléphone'
                  leftIcon={
                    <Icon
                      name='phone'
                      size={20}
                      color="#FFD15C"
                    />
                  }
                  onChangeText={(val) => setSignUpTel(val)}
                />
                <Input
                  containerStyle={{ marginBottom: 25, width: '70%' }}
                  inputStyle={{ marginLeft: 10 }}
                  placeholder='Mot de passe'
                  secureTextEntry={true}
                  leftIcon={
                    <Icon
                      name='key'
                      size={20}
                      color="#FFD15C"
                    />
                  }
                  onChangeText={(val) => setSignUpPassword(val)}
                />

                {tabErrorsSignup}

                <Button
                  onPress={async () => {
                    setSignUpStatus('Vigneron');
                    onSubmitUserstatus(signUpStatus);

                    var data = await fetch(`${URL}/sign-up`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&telFromFront=${signUpTel}&passwordFromFront=${signUpPassword}&statusFromFront=Vigneron`
                    })
                    var response = await data.json()

                    if (response.result == true) {
                      setIsVisible(true);
                      addToken(response.saveVigneron.token);

                    } else {
                      setlistErrorsSignup([...listErrorsSignup], response.error);
                    }
                  }}

                  containerStyle={{ marginBottom: 15, width: '70%', borderRadius: 15, }}
                  title="Je suis vigneron"
                  type="solid"
                  buttonStyle={{ backgroundColor: '#FFAE34' }}
                />

                <Button
                  onPress={async () => {

                    setSignUpStatus('Caviste');
                    onSubmitUserstatus(signUpStatus);

                    var data = await fetch(`${URL}/sign-up`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&telFromFront=${signUpTel}&passwordFromFront=${signUpPassword}&statusFromFront=Caviste`
                    })
                    var response = await data.json()

                    if (response.result == true) {
                      setIsVisible(true);
                      addToken(response.saveCaviste.token);
                    } else {
                      setlistErrorsSignup([...listErrorsSignup], response.error);
                    }
                  }}

                  containerStyle={{ marginBottom: 15, width: '70%', borderRadius: 15, }}
                  title="Je suis caviste"
                  type="solid"
                  buttonStyle={{ backgroundColor: '#FFAE34' }}
                />

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignIn');
                  }}
                >

                  <Text
                    style={{ color: '#A9A8A8' }}>J'ai déjà un compte</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCDF23',
    marginTop: 35
  },
  box: {
    width: 300,
    height: 580,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  text: {
    color: '#FFD15C',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16 * PixelRatio.getFontScale(),
    padding: 15,
  },
  popup: {
    width: 250,
    height: 300,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});


function mapDispatchToProps(dispatch) {
  return {
    addToken: function (token) {
      dispatch({ type: 'addToken', token: token })

    },
    onSubmitUserstatus: function (status) {
      dispatch({ type: 'saveUserstatus', status: status })
    }
  }
}

function mapStateToProps(state) {
  return { status: state.userstatus }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpScreen);