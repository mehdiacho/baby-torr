import React from 'react';
import { Card, ProgressBar, Button } from 'react-bootstrap';
import { formatBytes } from '../utils/format';

function TransferProgress({ status, onStart, showStartButton = true }) {
  const { inProgress, progress, currentFile } = status;

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Transfer Status</h5>
        {currentFile && (
          <p className="mb-2">
            Transferring: {currentFile.name} ({formatBytes(currentFile.size)})
          </p>
        )}
        <ProgressBar 
          now={progress} 
          label={`${Math.round(progress)}%`}
          animated={inProgress}
        />
        {showStartButton && !inProgress && (
          <Button
            variant="primary"
            className="mt-3"
            onClick={onStart}
          >
            Start Transfer
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default TransferProgress; 