import { useRef, useEffect } from 'react'
import sleep from '../utils/sleep'

const useAudio = (src, { volume = 1, playbackRate = 1, vibrate=false, loop=1 }={}) => {
    const audio = useRef(new Audio(src))
    const doVibrate = (time) => {
        vibrate && navigator.vibrate && navigator.vibrate([time/2,time/2])
    }
  
    useEffect(() => {
      audio.current.volume = volume
    }, [volume])
  
    useEffect(() => {
      audio.current.playbackRate = playbackRate
    }, [playbackRate])

    const playAudio = () => {
        audio.current.pause()
        audio.current.currentTime = 0
        audio.current.play()
        doVibrate((audio.current.duration)*1000)
    }

    const play = async () => {
        if(loop <=1) {
            playAudio()
            return
        }
        for(let i=0; i<loop; i++) {
            playAudio()
            await sleep(audio.current.duration * 1000)
        }
    }

    const pause = () => {
        audio.current.pause()
    }

        return { play, pause }
}

export default useAudio