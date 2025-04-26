// src/components/UploadButton.tsx
import React from "react";

type UploadButtonProps = {
  onClick: () => void;
};

export function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
    >
      Upload File
    </button>
  );
}
