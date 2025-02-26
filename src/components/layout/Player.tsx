import playIcon from "../../assets/images/player/play.svg";
import repeatIcon from "../../assets/images/player/repeat.svg";
import skNextIcon from "../../assets/images/player/skip_next.svg";
import skPreviousIcon from "../../assets/images/player/skip_previous.svg";
import shuffleIcon from "../../assets/images/player/shuffle.svg";
import volumeUpIcon from"../../assets/images/player/volume_up.svg";

import { Slider } from "radix-ui";

import styles from "./Player.module.css";

import PlayerBtn from "../common/PlayerBtn.tsx";
import {useEffect, useRef, useState} from "react";
import SongCardHoriz from "../ui/SongCardHoriz.tsx";


function Player(){
    const [currentProgress, setCurrentProgress] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current && !isSeeking) {
                const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setCurrentProgress(progress || 0);
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", updateProgress);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("timeupdate", updateProgress);
            }
        };
    }, [isSeeking]);

    const handleOnChangeProgress = (value: number[]) => {
        setCurrentProgress(value[0]);
        setIsSeeking(true);
    };

    const handleOnCommitProgress = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = (currentProgress / 100) * audioRef.current.duration;
        }
        setIsSeeking(false);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            <div style={{padding: "0px 15px"}}
                 className="p-8 flex items-center w-full bg-[var(--color-bg-primary-2)] h-[60px] rounded-lg
                 border-3 border-[var(--color-bas-primary-2)]
                 gap-8
                 col-span-2
                 ">

                <audio ref={audioRef}
                       src="http://localhost:9000/song/audio/946ab6b9-6ed9-4170-b75f-08335e484dae.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250219T042400Z&X-Amz-SignedHeaders=host&X-Amz-Credential=TWvEKFWytWUUAYab9FyE%2F20250219%2Fap-southeast-3%2Fs3%2Faws4_request&X-Amz-Expires=300&X-Amz-Signature=202ec7273d0304562bd1cb9965372616d9883e4bd2b29dfb941020709ce44be5"
                       preload="metadata"></audio>

                {/* Main player functions */}
                <section className={"flex"}>
                    <PlayerBtn icon={repeatIcon}/>
                    <PlayerBtn icon={skPreviousIcon}/>
                    <PlayerBtn icon={playIcon} onClick={togglePlay}/>
                    <PlayerBtn icon={skNextIcon}/>
                    <PlayerBtn icon={shuffleIcon}/>
                </section>

                {/* Progress Bar */}
                <section className={"flex items-center gap-3"}>
                    <p className={"text-sm"}>[timerstart]</p>
                    <Slider.Root
                        className={styles.SliderRoot}
                        value={[currentProgress]}
                        onValueChange={handleOnChangeProgress}
                        onValueCommit={handleOnCommitProgress}
                        max={100}
                        step={1}
                    >
                        <Slider.Track className={styles.SliderTrack}>
                            <Slider.Range className={styles.SliderRange}/>
                        </Slider.Track>
                        <Slider.Thumb className={styles.SliderThumb} aria-label="Progress"/>
                    </Slider.Root>
                    <p className={"text-sm"}>[timerend]</p>
                </section>

                <section>
                    <PlayerBtn icon={volumeUpIcon}/>
                </section>

                <section>
                    <SongCardHoriz title={"This is a really long song name"} authorName={"Author name"}></SongCardHoriz>
                </section>
            </div>
        </>
    );
}

export default Player;