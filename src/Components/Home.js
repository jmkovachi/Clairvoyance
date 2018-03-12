import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import Expo from 'expo';
import { Font } from 'expo';
console.disableYellowBox = true;


 

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
          'Cinzel-Regular': require('/home/jmkovachi/Documents/personal_projects/Clairvoyance/assets/fonts/Cinzel-Regular.ttf'),
        });

        this.setState({
            fontLoaded : true,
        });
        
    }

    render() {

        const resizeMode = 'center';

        return (
            
            <ImageBackground style={styles.backgroundImage} source={require('/home/jmkovachi/Documents/personal_projects/Clairvoyance/assets/home.png')}>
                <View style={styles.flex}>
                    {
                        this.state.fontLoaded ? (
                            <Text style={styles.customFont}> Some Text </Text>
                        ) : null
                    }
                    <Button
                        onPress={this.props.handle}
                        title={'Press me'}
                    />
                    
                </View>
            </ImageBackground>
            
        );
    }

    

}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    customFont: {
        fontFamily: 'Cinzel-Regular'
    }
  });