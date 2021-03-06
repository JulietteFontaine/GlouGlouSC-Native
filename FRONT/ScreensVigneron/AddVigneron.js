import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Button, Input, Avatar } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import URL from '../URL'

function AddVigneron({ navigation, token, userstatus }) {

  const [NomRef, setNomRef] = useState();
  const [Couleur, setCouleur] = useState();
  const [Cepage, setCepage] = useState();
  const [Millesime, setMillesime] = useState();
  const [Appellation, setAppellation] = useState();
  const [Desc, setDesc] = useState();

  const [image, setImage] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const [Error, setError] = useState([]);

  var ListError = Error.map((error, i) => {
    return (
      <View>
        <Text style={{ color: '#9D2A29' }}>{error}</Text>
      </View>
    )
  })

  // Demander accès à la bibliothèque photo
  useEffect(() => {

    if (image == null) {
      setImage(`require('../assets/gris.png')`)
      }
    
    (async () => {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (

    <View style={{ flex: 1 }}>

      <View style={styles.container}>

          <Image source={require('../assets/macave.png')} 
        style={{ width: 120, height: 100, marginTop: -10,
                  justifyContent:"center", 
                  alignItems: 'center' }}></Image>

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   >

          <ScrollView>
            <View style={styles.box1}>
              {/* <View style={styles.box2}> */}

                
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                
                  {image && <Avatar size={100} source={{ uri: image }} style={{ width: 150, height: 150 }}></Avatar>}
                
                <Text style={{ color: '#AAAAAA', marginTop: 10 }}
                  onPress={pickImage}>Ajouter une photo</Text>
              </View>

              <Input
                containerStyle={{ marginTop: 20, marginBottom: 20, width: '80%' }}
                inputStyle={{ marginLeft: 10 }}
                placeholder="Nom de la référence"
                onChangeText={(text) => setNomRef(text)}
                value={NomRef}
              />

              <Input
                containerStyle={{ marginBottom: 15, width: '80%' }}
                inputStyle={{ marginLeft: 10 }}
                placeholder="Couleur"
                onChangeText={(text) => setCouleur(text)}
                value={Couleur}
              />

              <Input
                containerStyle={{ marginBottom: 15, width: '80%' }}
                inputStyle={{ marginLeft: 10 }}
                placeholder="Cépage"
                disabled={disabled}
                onChangeText={(text) => setCepage(text)}
                value={Cepage}

              />

              <Input
                containerStyle={{ marginBottom: 15, width: '80%' }}
                inputStyle={{ marginLeft: 10 }}
                placeholder="Millésime"
                onChangeText={(text) => setMillesime(text)}
                value={Millesime}

              />
              <Input
                containerStyle={{ marginBottom: 15, width: '80%' }}
                inputStyle={{ marginLeft: 10 }}
                placeholder="Appellation"
                onChangeText={(text) => setAppellation(text)}
                value={Appellation}
              />

              <Input
                containerStyle={{ marginBottom: 15, width: '80%' }}
                inputStyle={{ marginLeft: 10 }}
                placeholder="Description"
                onChangeText={(text) => setDesc(text)}
                value={Desc}
              />

              <Text>{ListError}</Text>

              <Button
                icon={{ name: 'plus', type: 'font-awesome', color: '#FFFFFF' }}
                rounded
                type='font-awesome'
                buttonStyle={{ backgroundColor: '#FFAE34', borderRadius: 100, margin: 5 }}

                onPress={async () => {

                  navigation.navigate('Catalogue');
                  var data = new FormData();

                  if (image !== null) {
                  data.append('avatar', {
                    uri: image,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                  });
                }

                  var bottleinfos = {
                    NomRef: NomRef,
                    Couleur: Couleur,
                    Cepage: Cepage,
                    Millesime: Millesime,
                    AOC: Appellation,
                    Desc: Desc,
                    token: token,
                  };

                  data.append('bottleinfos', JSON.stringify(bottleinfos));

                  var newbottle = await fetch(`${URL}/AddVin`, {
                    method: 'post',
                    body: data
                  })
                  setCouleur('')
                }}

              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: responsiveScreenHeight(90),
    width: responsiveScreenWidth(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  box1: {
    flex: 1,
    alignItems: 'center',
    height: responsiveHeight(120),
    width: responsiveWidth(90),
    justifyContent: 'center',
  },
  responsiveBox: {
    width: wp('84.5%'),
    height: hp('17%'),
    borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  avatar: {
    height: 40,
    width: 40,
    backgroundColor: '#FFAE34',
    borderRadius: 100,
  }
});


function mapStateToProps(state) {
  return { token: state.token, userstatus: state.userstatus }
}

export default connect(
  mapStateToProps,
  null,
)(AddVigneron);