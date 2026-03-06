import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { JitsiTrackEvents } from '../lib-jitsi-meet';

import { trackStreamingStatusChanged } from './actions.any';
import { ITrack } from './types';

/**
 * Custom hook to subscribe to track streaming status changed events and update the redux store.
 *
 * @param {ITrack} track - The track for which to subscribe to events.
 * @returns {void}
 */
export function useTrackStreamingStatus(track?: ITrack) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (track && !track.local) {
            const handleTrackStreamingStatusChanged = (jitsiTrack: any, streamingStatus: string) => {
                dispatch(trackStreamingStatusChanged(jitsiTrack, streamingStatus));
            };

            track.jitsiTrack.on(JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, handleTrackStreamingStatusChanged);

            dispatch(trackStreamingStatusChanged(track.jitsiTrack, track.jitsiTrack.getTrackStreamingStatus?.()));

            return () => {
                track.jitsiTrack.off(
                    JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED,
                    handleTrackStreamingStatusChanged
                );

                dispatch(trackStreamingStatusChanged(track.jitsiTrack, track.jitsiTrack.getTrackStreamingStatus?.()));
            };
        }
    }, [ dispatch, track?.jitsiTrack ]);
}
