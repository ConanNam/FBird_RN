import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { appConfig } from "../api/FAxios";


const useWebSockets = ({ birdId, token, enabled }) => {
    const ref = useRef();
    const [reward, setReward] = useState(0)
    const [gameId, setGameId] = useState('')

    const sendPoint = (point) => {
        ref.current.emit(gameId, point)
    }

    useEffect(() => {
        if (!enabled) {
            return
        }
        const socket = io(appConfig.socketURL, {
            transports: ['websocket'],
            auth: {
                token
            }
        });

        socket.on("disconnect", () => {
            console.log('disconnected Socket')
        })

        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        });

        socket.on('reconnect', () => {
            socket.emit("start_game", birdId)
        })

        socket.emit("start_game", birdId)

        socket.on("error", err => {
            console.log('err', err)
        });

        socket.on("start_game_success", gameId => setGameId(gameId))
        socket.on(gameId, token => setReward(token))

        ref.current = socket

        return () => socket.disconnect()

    }, [enabled, birdId, token])

    return {
        sendPoint,
        reward,
        gameId
    }
}