import * as tus from "tus-js-client";
import { supabase } from "./supabase";

const RECORDINGS_BUCKET = "interview-recordings";
const MAX_RECORDING_BYTES = 45 * 1024 * 1024;

const projectRef = new URL(import.meta.env.VITE_SUPABASE_URL)
  .hostname.split(".")[0];

const uploadEndpoint =
  `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;

export async function uploadInterviewRecording(
  sessionId: string,
  recording: Blob,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  if (recording.size === 0) {
    throw new Error("The recording is empty.");
  }

  if (recording.size > MAX_RECORDING_BYTES) {
    throw new Error("The recording is larger than the 45 MB storage limit.");
  }

  const [
    {
      data: { user },
      error: userError,
    },
    {
      data: { session },
      error: sessionError,
    },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);

  if (userError || !user) {
    throw userError ?? new Error("Sign in before uploading a recording.");
  }

  if (sessionError || !session?.access_token) {
    throw sessionError ?? new Error("Your sign-in session has expired.");
  }

  const recordingType = recording.type || "video/webm";
  const extension = recordingType.toLowerCase().includes("mp4")
    ? "mp4"
    : "webm";
  const contentType = recordingType.split(";")[0] || `video/${extension}`;
  const path = `${user.id}/${sessionId}/interview.${extension}`;
  const file = new File([recording], `interview-${sessionId}.${extension}`, {
    type: contentType,
  });

  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: uploadEndpoint,
      chunkSize: 6 * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: RECORDINGS_BUCKET,
        objectName: path,
        contentType,
        cacheControl: "3600",
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        if (bytesTotal > 0) {
          onProgress?.(Math.round((bytesUploaded / bytesTotal) * 100));
        }
      },
      onError: reject,
      onSuccess: () => resolve(path),
    });

    void upload
      .findPreviousUploads()
      .then((previousUploads) => {
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      })
      .catch(reject);
  });
}

export async function downloadInterviewRecording(
  path: string,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(RECORDINGS_BUCKET)
    .download(path);

  if (error) {
    throw error;
  }

  return URL.createObjectURL(data);
}

export async function deleteInterviewRecording(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(RECORDINGS_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}