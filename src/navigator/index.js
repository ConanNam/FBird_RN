import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { MainStack, BottomTab } from "./MainNavigation";
import { isReadyRef, navigationRef } from './rootNavigation'

const Router = () => {
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                isReadyRef.current = true
            }}>
            <MainStack />
        </NavigationContainer>
    )
}

export default Router