import { addMilliseconds, format } from "date-fns";
import { IArtist } from "../interfaces/IArtist";
import { IPlaylist } from "../interfaces/IPlaylist";
import { ISong } from "../interfaces/ISong";
import { IUser } from "../interfaces/IUser";
import { newSong } from "./factories";

export function SpotifyUserToLocalUser(user : SpotifyApi.CurrentUsersProfileResponse) : IUser {
    return {
        id: user.id,
        name: user.display_name,
        imageUrl: user.images.pop().url
    };
}


export function SpotifyPlaylistToLocalPlaylist(playlist : SpotifyApi.PlaylistObjectSimplified) : IPlaylist {
    return {
        id: playlist.id,
        name : playlist.name,
        imageUrl : playlist.images.pop().url
    };
}

export function SpotifyArtistToLocalArtist(spotifyArtist: SpotifyApi.ArtistObjectFull) : IArtist {
    return {
        id: spotifyArtist.id,
        imageUrl: spotifyArtist.images.sort((a,b) => a.width - b.width).pop().url,
        name: spotifyArtist.name
    };
}

export function SpotifyTrackToLocalTrack(spotifyTrack: SpotifyApi.TrackObjectFull) : ISong {

    if(!spotifyTrack)
        return newSong();
    
    const msToMin = (ms: number) => {
        const data = addMilliseconds(new Date(0), ms);
        return format(data, 'mm:ss');
    }
    
    return {
        id: spotifyTrack.uri,
        title: spotifyTrack.name,
        album : {
            id : spotifyTrack.album.id,
            imageUrl: spotifyTrack.album.images.shift().url,
            name: spotifyTrack.album.name
        },
        artists: spotifyTrack.artists.map(artists => ({
            id: artists.id,
            name: artists.name
        })),
        time: msToMin(spotifyTrack.duration_ms)
    }
}