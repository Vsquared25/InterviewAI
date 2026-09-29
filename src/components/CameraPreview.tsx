import { useEffect, useRef, useState } from "react";

export function CameraPreview({
  onStreamChange,
}: {
  onStreamChange?: (stream: MediaStream | null) => void;
}) {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(false);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      onStreamChange?.(null);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [onStreamChange]);

  const toggleCamera = async () => {
    if (streamRef.current) {
      onStreamChange?.(null);
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (previewRef.current) {
        previewRef.current.srcObject = null;
      }

      setIsCameraOn(false);
      setCameraError("");
      return;
    }

    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access isn't available here. Use a supported browser on localhost or HTTPS.",
      );
      return;
    }

    setIsStarting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      onStreamChange?.(stream);

      if (previewRef.current) {
        previewRef.current.srcObject = stream;
      }

      setIsCameraOn(true);
    } catch (error) {
      if (!mountedRef.current) return;

      const errorName =
        error instanceof DOMException ? error.name : "";

      if (errorName === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser settings, then try again.",
        );
      } else if (errorName === "NotFoundError") {
        setCameraError(
          "No camera was found. Connect a camera or continue without video.",
        );
      } else {
        setCameraError(
          "The camera couldn't be started. Check that it's connected and not being used by another app.",
        );
      }
    } finally {
      if (mountedRef.current) {
        setIsStarting(false);
      }
    }
  };

  return (
    <section className="mt-6 rounded-2xl bg-violet-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-[Lexend] text-lg font-semibold text-slate-950">
            Camera preview
          </h2>
          <p className="mt-1 text-sm leading-6 text-violet-950">
            Optional camera and microphone preview. Use the video recording button below to capture a clip.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void toggleCamera()}
          disabled={isStarting}
          aria-pressed={isCameraOn}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-wait disabled:opacity-60"
        >
          {isStarting
            ? "Requesting access…"
            : isCameraOn
              ? "Turn camera and mic off"
              : "Enable camera and mic"}
        </button>
      </div>

      {cameraError && (
        <p role="alert" className="mt-3 text-sm font-semibold text-pink-700">
          {cameraError}
        </p>
      )}

      {isCameraOn && (
        <p role="status" className="mt-3 text-sm font-semibold text-violet-800">
          Camera and microphone are active. Use the video recording button below to start or stop capture.
        </p>
      )}

      <video
        ref={previewRef}
        autoPlay
        muted
        playsInline
        aria-label="Live camera preview"
        className={
          isCameraOn
            ? "mt-4 aspect-video w-full rounded-xl bg-slate-950 object-cover"
            : "hidden"
        }
      />
    </section>
  );
}
