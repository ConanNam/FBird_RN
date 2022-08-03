// RootNavigation.js

import * as React from 'react';
import { StackActions } from '@react-navigation/native'

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.navigate(name, params);
    }
}

export const goback = () => {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current?.goBack();
    }
}

export function navigateReplace(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current.dispatch(
            StackActions.replace(name, params),
        );
    }
}