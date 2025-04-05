class Song {
    songId: string;
    songName: string;
    artistId: string;
    artistName: string;
    duration?: number;

    constructor(songId: string, songName: string, artistId: string, artistName: string, duration?: number) {
        this.songId = songId;
        this.songName = songName;
        this.artistId = artistId;
        this.artistName = artistName;
        this.duration = duration;
    }
}

export default Song;
