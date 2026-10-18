import React, { useCallback, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { initiateConnection } from '../services/connectionService';

function FileUpload({ onConnectionEstablished }) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const connection = await initiateConnection(acceptedFiles);
      onConnectionEstablished(connection);
    }
  }, [onConnectionEstablished]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  });

  return (
    <Card 
      {...getRootProps()} 
      className={`drop-zone ${isDragging ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <Card.Body>
        <h4>Drag & Drop Files Here</h4>
        <p>or click to select files</p>
      </Card.Body>
    </Card>
  );
}

export default FileUpload; 