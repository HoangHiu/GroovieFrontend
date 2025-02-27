import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Slider } from "radix-ui";
import styles from "./Player.module.css";
import PlayerBtn from "../common/PlayerBtn.tsx";
import SongCardHoriz from "../ui/SongCardHoriz.tsx";
import Song from "../../models/Song.ts";

import playIcon from "../../assets/images/player/play.svg";
import pauseIcon from "../../assets/images/player/pause.svg";
import repeatIcon from "../../assets/images/player/repeat.svg";
import skNextIcon from "../../assets/images/player/skip_next.svg";
import skPreviousIcon from "../../assets/images/player/skip_previous.svg";
import shuffleIcon from "../../assets/images/player/shuffle.svg";
import volumeUpIcon from "../../assets/images/player/volume_up.svg";

function Player(
    { album, songIndex, setSongIndex }:
    { album:Song[], songIndex: number, setSongIndex:React.Dispatch<React.SetStateAction<number>> }) {
    const [currentProgress, setCurrentProgress] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoaWV1TmV3QWNjb3VudCIsImlhdCI6MTc0MDY2Njg1OCwiZXhwIjoxNzQwNzc0ODU4fQ.Sd0qXWsOo6cNsttcmQL3eQuNoCjAWQbOBNXNawj39vwPlOCJaYdYOGD1Lwd9Hymob00r6uX7DtxkMzlx05qAfw"

        if (album[songIndex]) {
            axios({
                headers: {
                    Authorization: "Bearer " + token,
                },
                url: `http://localhost:8080/v1/song/${album[songIndex].songId}/audio`,
                method: "get",
            })
                .then((response) => response.data.data)
                .then((songUrl) => {
                    if (audioRef.current) {
                        audioRef.current.src = songUrl;
                        audioRef.current.play();
                        setIsPlaying(true);
                    }
                });
        }
    }, [songIndex]);

    // Song progression tracking
    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current && !isSeeking) {
                const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setCurrentProgress(progress || 0);
            }
        };

        const handleSongEnd = () => {
            if (songIndex < album.length - 1) {
                setSongIndex(songIndex + 1);
            } else {
                setSongIndex(0);
            }
            if (audioRef.current){audioRef.current.pause()}
        };

        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", updateProgress);
            audioRef.current.addEventListener("ended", handleSongEnd);
            audioRef.current.addEventListener("loadedmetadata", () => {
                setDuration(audioRef.current?.duration || 0);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("timeupdate", updateProgress);
                audioRef.current.removeEventListener("ended", handleSongEnd);
            }
        };
    }, [isSeeking]);


    // Handle slider change (dragging)
    const handleOnChangeProgress = (value: number[]) => {
        setCurrentProgress(value[0]);
        setIsSeeking(true);
    };

    // Handle slider commit (release)
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

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const playNextSong = ()=> {
        if (songIndex < album.length - 1) {
            setSongIndex(songIndex + 1);
        } else {
            setSongIndex(0);
        }
    }

    return (
        <div className="p-8 flex items-center w-full bg-[var(--color-bg-primary-2)] h-[60px] rounded-lg border-3 border-[var(--color-bas-primary-2)] gap-8 col-span-2">
            <audio ref={audioRef} preload="metadata"></audio>

            {/* Main player functions */}
            <section className="flex">
                <PlayerBtn icon={repeatIcon} />
                <PlayerBtn icon={skPreviousIcon} />
                <PlayerBtn icon={isPlaying ? pauseIcon : playIcon} onClick={togglePlay} />
                <PlayerBtn icon={skNextIcon} onClick={playNextSong}/>
                <PlayerBtn icon={shuffleIcon} />
            </section>

            {/* Progress Bar */}
            <section className="flex items-center gap-3 w-[350px]">
                <p className="text-sm">{formatTime((currentProgress / 100) * duration)}</p>
                <Slider.Root
                    className={styles.SliderRoot}
                    value={[currentProgress]}
                    onValueChange={handleOnChangeProgress}
                    onValueCommit={handleOnCommitProgress}
                    max={100}
                    step={1}
                >
                    <Slider.Track className={styles.SliderTrack}>
                        <Slider.Range className={styles.SliderRange} />
                    </Slider.Track>
                    <Slider.Thumb className={styles.SliderThumb} aria-label="Progress" />
                </Slider.Root>
                <p className="text-sm">{formatTime(duration)}</p>
            </section>

            <section>
                <PlayerBtn icon={volumeUpIcon} />
            </section>

            <section>
                {album[songIndex] ? (
                    <SongCardHoriz title={album[songIndex].songName} authorName={album[songIndex].artistName} />
                ) : (
                    <p className="text-gray-500">Select a song to play</p>
                )}
            </section>
        </div>
    );
}

export default Player;
