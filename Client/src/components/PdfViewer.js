import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PdfViewer = () => {
  const { ID_publicized } = useParams();
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    fetch(`/api/getflieNews/${ID_publicized}`)
      .then((response) => response.json())
      .then((data) => {
        setPdfData(data.pdfData); 
      })
      .catch((error) =>
        console.error('Error fetching SubTaskOptions:', error)
      );
  }, [ID_publicized]);

  return (
    <div>
      {pdfData && (
        <embed
          src={`data:application/pdf;base64,${pdfData}`} 
          type="application/pdf"
          width="100%"
          height="1200px"
        />
      )}
    </div>
  );
};

export default PdfViewer;
