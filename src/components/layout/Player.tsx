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
import shuffleOnIcon from "../../assets/images/player/shuffle_on.svg";
import repeatOnIcon from "../../assets/images/player/repeat_on.svg";

function Player({
                    album,
                    songIndex,
                    setSongIndex,
                }: {
    album: Song[];
    songIndex: number;
    setSongIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [currentProgress, setCurrentProgress] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoop, setIsLoop] = useState<boolean>(false);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
    const [volume, setVolume] = useState(50);

    useEffect(() => {
        if (!album[songIndex]) return;
        axios
            .get(`http://localhost:8080/v1/song/${album[songIndex].songId}/audio`)
            .then((res) => res.data.data)
            .then((songUrl) => {
                if (audioRef.current) {
                    audioRef.current.src = songUrl;
                    audioRef.current.play();
                    setIsPlaying(true);
                }
            });
    }, [songIndex, album]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (!isSeeking) {
                const pct = (audio.currentTime / audio.duration) * 100;
                setCurrentProgress(pct || 0);
            }
        };

        const handleSongEnd = () => {
            if (songIndex < album.length - 1) {
                if (isShuffle) {
                    setSongIndex(Math.floor(Math.random() * album.length));
                } else {
                    setSongIndex((i) => (i < album.length - 1 ? i + 1 : 0));
                }
            } else {
                if (isLoop) {
                    setSongIndex(0);
                    audio.play();
                } else {
                    setIsPlaying(false);
                    audio.pause();
                }
            }
        };

        const handleLoaded = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleSongEnd);
        audio.addEventListener("loadedmetadata", handleLoaded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleSongEnd);
            audio.removeEventListener("loadedmetadata", handleLoaded);
        };
    }, [
        songIndex,
        album.length,
        isSeeking,
        isLoop,
        isShuffle,
        setSongIndex,
    ]);

    const handleOnChangeProgress = (value: number[]) => {
        setCurrentProgress(value[0]);
        setIsSeeking(true);
    };

    const handleOnCommitProgress = () => {
        if (audioRef.current) {
            audioRef.current.currentTime =
                (currentProgress / 100) * audioRef.current.duration;
        }
        setIsSeeking(false);
    };

    const handleVolumeChange = (value: number[]) => {
        const vol = value[0];
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol / 100;
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const toggleLoop = () => setIsLoop((l) => !l);
    const toggleShuffle = () => setIsShuffle((s) => !s);
    const toggleVolumeSlider = () =>
        setIsVolumeSliderOpen((o) => !o);

    return (
        <div className="p-8 flex items-center w-full bg-[var(--color-bg-primary-2)] h-[60px] rounded-lg border-3 border-[var(--color-bas-primary-2)] gap-8 col-span-2">
            <audio ref={audioRef} preload="metadata" />

            {/* Controls */}
            <section className="flex">
                <PlayerBtn icon={isLoop ? repeatOnIcon : repeatIcon} onClick={toggleLoop} />
                <PlayerBtn icon={skPreviousIcon} onClick={() => {
                    if (isShuffle) {
                        setSongIndex(Math.floor(Math.random() * album.length));
                    } else {
                        setSongIndex((i) => (i > 0 ? i - 1 : album.length - 1));
                    }
                }} />
                <PlayerBtn icon={isPlaying ? pauseIcon : playIcon} onClick={togglePlay} />
                <PlayerBtn icon={skNextIcon} onClick={() => {
                    if (isShuffle) {
                        setSongIndex(Math.floor(Math.random() * album.length));
                    } else {
                        setSongIndex((i) => (i < album.length - 1 ? i + 1 : 0));
                    }
                }} />
                <PlayerBtn icon={isShuffle ? shuffleOnIcon : shuffleIcon} onClick={toggleShuffle} />
            </section>

            {/* Progress */}
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

            {/* Volume */}
            <section className="relative">
                <PlayerBtn icon={volumeUpIcon} onClick={toggleVolumeSlider} />
                {isVolumeSliderOpen && (
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-8 h-28 flex justify-center items-center rounded-md shadow-lg z-10">
                        <Slider.Root
                            className="relative w-5 h-20 flex justify-center items-center"
                            orientation="vertical"
                            value={[volume]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                        >
                            <Slider.Track className="relative w-1 h-full bg-gray-700 rounded-full">
                                <Slider.Range className="absolute bottom-0 w-full bg-white rounded-full" />
                            </Slider.Track>
                            <Slider.Thumb className={styles.SliderThumb} />
                        </Slider.Root>
                    </div>
                )}
            </section>

            {/* Now playing info */}
            <section>
                {album[songIndex] ? (
                    <SongCardHoriz
                        title={album[songIndex].songName}
                        authorName={album[songIndex].artistName}
                    />
                ) : (
                    <p className="text-gray-500">Select a song to play</p>
                )}
            </section>
        </div>
    );
}

export default Player;
