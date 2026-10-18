import React, { useState } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import ShareLink from '../components/ShareLink';
import TransferProgress from '../components/TransferProgress';

function Home() {
  const [connection, setConnection] = useState(null);
  const [transferStatus, setTransferStatus] = useState({
    inProgress: false,
    progress: 0,
    currentFile: null,
    error: null
  });

  const handleConnectionEstablished = (conn) => {
    setConnection(conn);
  };

  const handleTransferStart = async () => {
    if (!connection) return;

    setTransferStatus({
      inProgress: true,
      progress: 0,
      currentFile: connection.files[0],
      error: null
    });

    try {
      for (const file of connection.files) {
        setTransferStatus(prev => ({ ...prev, currentFile: file }));
        await sendFile(connection.peer, file, (progress) => {
          setTransferStatus(prev => ({ ...prev, progress }));
        });
      }
    } catch (error) {
      setTransferStatus(prev => ({ ...prev, error: error.message }));
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        {!connection ? (
          <FileUpload onConnectionEstablished={handleConnectionEstablished} />
        ) : (
          <>
            <ShareLink roomId={connection.roomId} />
            <TransferProgress status={transferStatus} onStart={handleTransferStart} />
          </>
        )}
        
        {transferStatus.error && (
          <Alert variant="danger" className="mt-3">
            {transferStatus.error}
          </Alert>
        )}
      </Col>
    </Row>
  );
}

export default Home; 