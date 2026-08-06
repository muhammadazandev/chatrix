import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

const AudioWaves = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const waveSurfer = useRef(null);

  useEffect(() => {
    waveSurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      url: audioUrl,
    });

    return () => {
      waveSurfer.current.destroy();
    };
  }, [audioUrl]);

  return <div ref={waveformRef} />;
};

export default AudioWaves;
