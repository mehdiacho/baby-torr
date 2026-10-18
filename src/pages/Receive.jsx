import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, ProgressBar, Alert } from 'react-bootstrap';
import { joinConnection } from '../services/connectionService';
import TransferProgress from '../components/TransferProgress';

function Receive() {
  const { roomId } = useParams();
  const [status, setStatus] = useState({
    connected: false,
    receiving: false,
    progress: 0,
    error: null
  });

  useEffect(() => {
    const connect = async () => {
      try {
        const peer = await joinConnection(roomId);
        setStatus(prev => ({ ...prev, connected: true }));

        let receivedSize = 0;
        let fileSize = 0;
        let chunks = [];

        peer.on('data', (data) => {
          if (!status.receiving) {
            setStatus(prev => ({ ...prev, receiving: true }));
          }

          chunks.push(data);
          receivedSize += data.byteLength;
          const progress = (receivedSize / fileSize) * 100;
          setStatus(prev => ({ ...prev, progress }));
        });

      } catch (error) {
        setStatus(prev => ({ ...prev, error: error.message }));
      }
    };

    connect();
  }, [roomId]);

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <Card>
          <Card.Body>
            <h4>Receiving Files</h4>
            {status.error ? (
              <Alert variant="danger">{status.error}</Alert>
            ) : status.receiving ? (
              <TransferProgress 
                progress={status.progress} 
                showStartButton={false}
              />
            ) : (
              <p>Waiting for connection...</p>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Receive; 