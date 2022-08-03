import * as React from 'react';
import { View, StatusBar, TouchableOpacity, Text, Image } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { io } from 'socket.io-client';
import FInfo from 'react-native-sensitive-info'
import { utils } from 'ethers'
import {showAlert, TYPE} from '../../components/Alert'
// Images
import Images from '../../assets/Images';

// Components
import { Bird, Physics, Floor } from '../../components/game';

// Config
import Constants from '../../constants/index';
import Styles from '../../constants/styles';

// Functions
import { resetPipes } from '../../utils/gameHelper';
import { goback, navigateReplace } from '../../navigator/rootNavigation';
import { appConfig } from '../../api/FAxios';

class Game extends React.Component {
  constructor(props) {
    super(props);
    console.log("🚀 ~ file: index.js ~ line 24 ~ Game ~ constructor ~ props", props)
    this.selectedBird = props.route.params
    console.log("🚀 ~ file: index.js ~ line 23 ~ Game ~ constructor ~ this.selectedBird", this.selectedBird)
    this.gameEngine = null;
    this.entities = this.setupWorld();
    this.token = null
    this.bearToken = this.getBearToken()

    this.state = {
      running: true,
      score: 0,
      reward: 0,
      gameId: ''
    }
  }



  getBearToken = async () => {
    return await FInfo.getItem('BearerToken', {})
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;

    world.gravity.y = 0.0;

    let bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT / 2, Constants.BIRD_WIDTH, Constants.BIRD_HEIGHT);

    let floor1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
    );

    let floor2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
      Constants.MAX_HEIGHT - 25,
      Constants.MAX_WIDTH + 4,
      50,
      { isStatic: true }
    );

    Matter.World.add(world, [bird, floor1, floor2]);
    Matter.Events.on(engine, 'collisionStart', (event) => {
      let pairs = event.pairs;

      this.gameEngine.dispatch({ type: "game-over" });
    });

    return {
      physics: { engine: engine, world: world },
      floor1: { body: floor1, renderer: Floor },
      floor2: { body: floor2, renderer: Floor },
      bird: { body: bird, pose: 1, selectedBird: this.props.route.params.star, renderer: Bird }
    };
  }

  onEvent = (e) => {
    if (e.type === "game-over") {
      this.setState({
        running: false
      })
      this.socket.emit(`end_game_${this.state.gameId}`, () => {
        console.log('emit end game')
      })
      console.log("🚀 ~ file: index.js ~ line 94 ~ Game ~ this.state.gameId", this.state.gameId)
    } else if (e.type === "score") {
      this.setState({
        score: this.state.score + 1
      });
      this.socket.emit(this.state.gameId, this.state.score)
    }
  }

  reset = () => {
    resetPipes();
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      score: 0,
      reward: 0
    })
    this.socket.emit("start_game", this.props.route.params._id)
  }

  goHome = () => {
    this.socket.disconnect()
    navigateReplace('Home')
  }

  async componentDidMount() {

    console.log('this.state', this.state)

    const token = await FInfo.getItem('BearerToken', {})

    console.log('token', token)
    this.socket = io(appConfig.socketURL, {
      transports: ['websocket'],
      auth: {
        token: token
      },
    });

    this.socket.on("disconnect", () => {
      console.log('disconnected Socket')
    })

    this.socket.on("connect", () => {
      console.log("🚀 ~ file: index.js ~ line 137 ~ Game ~ this.socket.on ~ this.props.selectedBird._id", this.props)
      console.log(this.socket.id); // x8WIv7-mJelg7on_ALbx
    });

    this.socket.on('reconnect', () => {
      this.socket.emit("start_game", this.props.selectedBird._id)

    })

    this.socket.emit("start_game", this.props.route.params._id)

    this.socket.on("error", err => {
      console.log('err', err)
      if(err.code == 10105){
        showAlert(TYPE.ERROR,err.messageCode,err.message)
      }else {
        showAlert(TYPE.ERROR,err.messageCode,err.message)
      }
      
      navigateReplace('Home')
    });

    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    this.socket.on("start_game_success", gameId => {
      console.log("🚀 ~ file: index.js ~ line 152 ~ Game ~ componentDidMount ~ gameId", gameId)

      this.setState({ gameId: gameId })

      this.socket.on(gameId, token => {
        console.log('token', token)
        this.setState({ reward: token })
      })
      this.socket.on('end_game_success', reward => console.log('reward', reward))
    })

  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    return (
      <View style={Styles.container}>

        <Image
          source={Images.background}
          style={Styles.backgroundImage}
          resizeMode="stretch"
        />
        <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style={Styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}
        >
          <StatusBar hidden={true} />
        </GameEngine>
        <Text style={Styles.score}>{this.state.score}</Text>
        <View style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 20, backgroundColor: 'white', borderRadius: 20, padding: 10 }}>
          <Text >{`${this.state.reward?.toFixed(2)} FBT`}</Text>
        </View>

        {!this.state.running && (
          <View style={Styles.fullScreenButton}>
            <View style={Styles.fullScreen}>
              <Text style={Styles.gameOverText}>Congratulation!</Text>
              <Text style={[Styles.gameOverSubText, { marginTop: 20 }]}>{`You earned ${this.state.reward?.toFixed(2)} FBT`}</Text>
              <TouchableOpacity style={{ padding: 20, borderRadius: 20 }}
                onPress={this.reset}><Text style={Styles.gameOverSubText}>Play Again!</Text></TouchableOpacity>
              <TouchableOpacity style={{ padding: 20, borderRadius: 20 }}
                onPress={this.goHome}><Text style={Styles.gameOverSubText}>Go back!</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }


}

export default Game;