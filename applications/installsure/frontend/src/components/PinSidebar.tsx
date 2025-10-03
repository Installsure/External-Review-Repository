import React, { useState } from "react";

interface Pin {
  id: string;
  x: number;
  y: number;
  note: string;
  photoUrl?: string;
  status: string;
}

interface Props {
  pin: Pin | null;
  onUpdate: (updates: Partial<Pin>) => void;
}

export default function PinSidebar({ pin, onUpdate }: Props) {
  const [note, setNote] = useState(pin?.note || "");
  const [status, setStatus] = useState(pin?.status || "open");

  React.useEffect(() => {
    if (pin) {
      setNote(pin.note || "");
      setStatus(pin.status || "open");
    }
  }, [pin]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate({ photoUrl: url });
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    onUpdate({ note: value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    onUpdate({ status: value });
  };

  if (!pin) {
    return (
      <div className="p-4 bg-gray-50 border-l">
        <p className="text-gray-500">Select a pin to view details</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-l space-y-4">
      <h3 className="font-semibold text-lg">Pin Details</h3>
      
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
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {pin.photoUrl && (
          <img 
            src={pin.photoUrl} 
            alt="Pin attachment" 
            className="mt-2 max-w-full h-auto rounded"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note
        </label>
        <textarea
          placeholder="Add note"
          value={note}
          onChange={handleNoteChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
}
