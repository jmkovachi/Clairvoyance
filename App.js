import React from 'react';
import { StyleSheet, Text, View, Button, Geolocation } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import Expo from 'expo';
import Home from './src/Components/Home.js';
import ColladaLoader from 'three-collada-loader';
import GeolocationExample from './src/Components/Geolocation.js'
import Geo from './src/Helpers/Geolocation.js';
import { Math } from 'three';
console.disableYellowBox = true;

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      clicked : false,
      latitude : null,
      longitude : null,
      magHeading : null,
      trueHeading : null,
    };
    this.handle = this.handle.bind(this);
    this.currentPos = this.currentPos.bind(this);
  }
  
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.state.latitude = position.coords.latitude;
        this.state.longitude = position.coords.longitude;
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    Expo.Location.watchHeadingAsync(function (res) {
      this.state.magHeading = res.magHeading;
      this.state.trueHeading = res.trueHeading;
      console.log(this.state);
    }.bind(this));
  }

  handle() {
    this.setState({ clicked : true });
  }

  render() {
    if (this.state.clicked) {
      return (<Expo.GLView
        ref={(ref) => this._glView = ref}
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}
      />);
    }
    else { 
      return (<Home handle={this.handle}/>);
    }
    /*return (<GeolocationExample/>)*/
  }

  addArrow() {

   
  }

  currentPos() {
      
  }

  componentWillUnmount() {
    if (this._requestAnimationFrameID) {
      cancelAnimationFrame(this._requestAnimationFrameID);
    }
  }

  _onGLContextCreate = async (gl) => {
    const arSession = await this._glView.startARSessionAsync();
    const scene = new THREE.Scene();
    const camera = ExpoTHREE.createARCamera(
      arSession,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
      0.01,
      1000
    );
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);
    const geometry = new THREE.BoxGeometry(.07, .07, .07);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = -0.4;
    scene.add(cube);

    /*var geo = new THREE.Geometry();

    geo.vertices.push(
      new THREE.Vector3( -10,  10, 0 ),
      new THREE.Vector3( -10, -10, 0 ),
      new THREE.Vector3(  10, -10, 0 )
    );

    geo.faces.push( new THREE.Face3( 0, 1, 2 ) );

    geo.computeBoundingSphere();

    var mater = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var mesh = new THREE.Mesh( geo, mater );

    mesh.position.z = -0.7;*/

    var directions = new Geo();

    await this.currentPos();

    console.log(this.state.latitude);
    console.log(this.state.magHeading);

    console.log(directions.bearing(this.state.latitude, this.state.longitude, 34.040337, -84.503497));

    var angle = directions.convertToRotation(this.state.latitude, this.state.longitude, 34.04456, -84.498465, this.state.magHeading);

    console.log(angle);

    var dir = new THREE.Vector3( 0, 0, -3 );

    //normalize the direction vector (convert to vector of length 1)

    /*var a = new THREE.Euler( 0, 6.28 - directions._toRad(angle), 0, 'XYZ' );

    dir.applyEuler(a);*/
    dir.normalize();

    var origin = new THREE.Vector3( 0, 0, -1 );
    var length = 1;
    var hex = 0xffff00;

    var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    arrowHelper.line.material.linewidth = 15;

    scene.add( arrowHelper );

    //scene.add( mesh );

    /*const modelFiles = {
      "model.dae": require('/home/jmkovachi/Documents/personal_projects/Clairvoyance/models/model.dae'),
    }
    const file = modelFiles["model.dae"];
    const onProgress = xhr => {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    const assetProvider = assetNamed => {
        return modelFiles[assetNamed];
    };

    const mesh = await loadBasicDAE();
    scaleLongestSideToSize(mesh, 3);
    alignMesh(mesh, { y: 1 });
    scene.add(mesh);;*/

    var heading = this.state.magHeading;
    const animate = () => {
      this._requestAnimationFrameID = requestAnimationFrame(animate);

      const now = 0.001 * global.nativePerformanceNow();
      const dt = typeof lastFrameTime !== 'undefined'
        ? now - lastFrameTime
        : 0.16666;
      //console.log('hi');
      if (heading !== this.state.magHeading) {
        
        heading = this.state.magHeading;
        var angle = directions.convertToRotation(this.state.latitude, this.state.longitude, 34.04456, -84.498465, this.state.magHeading);
        var a = new THREE.Euler( 0, 6.28 - directions._toRad(angle), 0, 'XYZ' );
        dir = new THREE.Vector3( 0, 0, -3 );
        dir.applyEuler(a);
        dir.normalize();
        arrowHelper.setDirection(dir);
      }


      renderer.render(scene, camera);
      gl.endFrameEXP();
      lastFrameTime = now;
    }
    animate();
  }
}

const onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};


async function loadBasicDAE() {
  const model = {
    "model.dae": require('/home/jmkovachi/Documents/personal_projects/Clairvoyance/models/model.dae'),
  };

  const collada = await ExpoTHREE.loadAsync([model['model.dae']], onProgress, name => model[name]);

  return collada;
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
