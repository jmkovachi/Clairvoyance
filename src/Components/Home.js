import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import Expo from 'expo';
console.disableYellowBox = true;

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.flex}>
                <Button
                    onPress={this.props.handle}
                    title={'Press me'}
                />
            </View>
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
  });