import React from "react";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createStackNavigator } from '@react-navigation/stack';

import Game from '../screens/Game'
import Gallery from '../screens/Gallery'
import LeaderBoard from '../screens/Leaderboard'
import Marketplace from '../screens/MarketPlace'
import Wallet from '../screens/Wallet'
import Login from "../screens/Login/Login";
import DetailBird from "../screens/Gallery/components/DetailBird";
import { SCREEN } from '../constants/screen'
import SelectBird from "../screens/Game/SelectBird";
import SplashScreen from "../screens/Login/SplashScreen";
import WalletOutGame from "../screens/Wallet/WalletOutGame";
import Send from "../screens/Wallet/Send";
import Receive from "../screens/Wallet/Receive";
import ImportWallet from "../screens/Wallet/ImportWallet";
import Spending from "../screens/Wallet/Spending";
import Trade from "../screens/Wallet/Trade";
import Transfer from "../screens/Wallet/Transfer";
import CreateNewWallet from "../screens/Wallet/CreateNewWallet";
import Setting from "../screens/Wallet/Setting";
import MintBox from "../screens/Wallet/MintBox";
import ClaimToken from "../screens/Wallet/ClaimToken";
import MyBoxes from "../screens/Wallet/MyBoxes";
import Backup from "../screens/Wallet/Backup";

const Tabs = AnimatedTabBarNavigator();
const Stacks = createStackNavigator();



const BottomTab = () => {
    return (
        <Tabs.Navigator
            tabBarOptions={{
                activeTintColor: "#2F7C6E",
                inactiveTintColor: "#222222",

            }}
            tabStyle={{
                showlable: false
            }}
            appearance={
                {
                    floating: true,
                    whenActiveShow: 'icon-only'
                }
            }
        >
            <Tabs.Screen
                name={SCREEN.SelectBird}
                component={SelectBird}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name="ios-game-controller-outline"
                            size={size ? size : 24}
                            color={focused ? color : "#222222"}
                            focused={focused}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="Gallery"
                component={Gallery}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons
                            name="bird"
                            size={size ? size : 24}
                            color={focused ? color : "#222222"}
                            focused={focused}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="LeaderBoard"
                component={LeaderBoard}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons
                            name="leaderboard"
                            size={size ? size : 24}
                            color={focused ? color : "#222222"}
                            focused={focused}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="Marketplace"
                component={Marketplace}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons
                            name="cart"
                            size={size ? size : 24}
                            color={focused ? color : "#222222"}
                            focused={focused}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="Wallet"
                component={Wallet}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name="ios-wallet"
                            size={size ? size : 24}
                            color={focused ? color : "#222222"}
                            focused={focused}
                            color={color}
                        />
                    )
                }}
            />
        </Tabs.Navigator>
    )
}

const MainStack = () => {
    return (
        <Stacks.Navigator>
            {/* <Stacks.Screen name={SCREEN.Game} component={Game} options={{ headerShown: false }} /> */}
            <Stacks.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stacks.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stacks.Screen name="WalletOutGame" component={WalletOutGame} options={{ headerShown: false }} />
            <Stacks.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
            <Stacks.Screen name="Send" component={Send} options={{ headerShown: false }} />
            <Stacks.Screen name="Receive" component={Receive} options={{ headerShown: false }} />
            <Stacks.Screen name="Trade" component={Trade} options={{ headerShown: false }} />
            <Stacks.Screen name="Transfer" component={Transfer} options={{ headerShown: false }} />
            <Stacks.Screen name="Spending" component={Spending} options={{ headerShown: false }} />
            <Stacks.Screen name="ImportWallet" component={ImportWallet} options={{ headerShown: false }} />
            <Stacks.Screen name="CreateNewWallet" component={CreateNewWallet} options={{ headerShown: false }} />
            <Stacks.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
            <Stacks.Screen name="MintBox" component={MintBox} options={{ headerShown: false }} />
            <Stacks.Screen name={SCREEN.ClaimToken} component={ClaimToken} options={{ headerShown: false }} />
            <Stacks.Screen name="MyBoxes" component={MyBoxes} options={{ headerShown: false }} />
            <Stacks.Screen name="Backup" component={Backup} options={{ headerShown: false }} />
            
            <Stacks.Screen name="DetailBird" component={DetailBird} options={{ headerShown: false }} />
            <Stacks.Screen name="GalleryStack" component={Gallery} options={{ headerShown: false }} />

            <Stacks.Screen
                options={{
                    headerShown: false
                }}
                name="Home" component={BottomTab} />
            <Stacks.Screen name={SCREEN.Game} component={Game} options={{ headerShown: false }} />
        </Stacks.Navigator>
    )
}

export { MainStack, BottomTab }