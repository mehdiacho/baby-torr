import React, { useState } from 'react';
import { Card, InputGroup, Form, Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';

function ShareLink({ roomId }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/receive/${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>Share Link</h5>
        <InputGroup className="mb-3">
          <Form.Control
            value={shareUrl}
            readOnly
          />
          <Button 
            variant={copied ? "success" : "primary"}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </InputGroup>
        
        <div className="text-center">
          <QRCode 
            value={shareUrl}
            size={128}
            level="H"
            includeMargin={true}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default ShareLink; 