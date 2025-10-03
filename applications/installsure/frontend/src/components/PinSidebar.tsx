import React, { useState } from "react";

interface Pin {
  id: string;
  x: number;
  y: number;
  note: string;
  photoUrl?: string;
  status: "open" | "resolved";
}

interface Props {
  pins: Pin[];
  selectedPin?: Pin;
  onPinUpdate: (pinId: string, updates: Partial<Pin>) => void;
}

export default function PinSidebar({ pins, selectedPin, onPinUpdate }: Props) {
  const [note, setNote] = useState(selectedPin?.note || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (selectedPin) {
      setNote(selectedPin.note);
    }
  }, [selectedPin?.id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedPin) {
      setPhotoFile(file);
      // Create a local URL for preview
      const photoUrl = URL.createObjectURL(file);
      onPinUpdate(selectedPin.id, { photoUrl });
    }
  };

  const handleNoteSave = () => {
    if (selectedPin) {
      onPinUpdate(selectedPin.id, { note });
    }
  };

  if (!selectedPin) {
    return (
      <div className="w-80 bg-white border-l p-4">
        <h3 className="text-lg font-semibold mb-4">Pin Details</h3>
        <p className="text-gray-500">Select a pin to view details</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l p-4">
      <h3 className="text-lg font-semibold mb-4">Pin Details</h3>
      
      <div className="space-y-4">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {selectedPin.photoUrl && (
            <img
              src={selectedPin.photoUrl}
              alt="Pin attachment"
              className="mt-2 w-full h-48 object-cover rounded"
            />
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            placeholder="Add note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleNoteSave}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={selectedPin.status}
            onChange={(e) => onPinUpdate(selectedPin.id, { status: e.target.value as "open" | "resolved" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Pin Info */}
        <div className="text-xs text-gray-500">
          <p>Position: ({(selectedPin.x * 100).toFixed(1)}%, {(selectedPin.y * 100).toFixed(1)}%)</p>
          <p>ID: {selectedPin.id}</p>
        </div>
      </div>
    </div>
  );
}
