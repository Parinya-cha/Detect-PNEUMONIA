
// โค้ดนี้ผมเอาไว้ใสำหรับโหลดโมเดลที่อยู่ในโฟลเดอร์ public/model 
import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Container, Typography, Box, CircularProgress,
  Paper, Grid, Snackbar, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as tf from '@tensorflow/tfjs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function XRayAnalysis() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('/model/model.json');
      console.log("Model loaded successfully");
      console.log("Model summary:", loadedModel.summary());
      setModel(loadedModel);
    } catch (error) {
      console.error('Failed to load model:', error);
      setError('Failed to load AI model. Please try again later.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
      setPrediction(null);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!model || !image) return;

    setLoading(true);
    try {
      const img = new Image();
      img.src = image;
      await img.decode();

      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims();

      const predictions = await model.predict(tensor).data();
      console.log("Raw predictions:", predictions);

      let result;
      let confidence;
      if (predictions.length === 1) {
        confidence = Math.max(predictions[0], 1 - predictions[0]);
        result = predictions[0] > 0.5 ? 'PNEUMONIA' : 'NORMAL';
      } else if (predictions.length === 2) {
        confidence = Math.max(predictions[0], predictions[1]);
        result = predictions[0] > predictions[1] ? 'NORMAL' : 'PNEUMONIA';
      } else {
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        confidence = predictions[maxIndex];
        result = ['NORMAL', 'PNEUMONIA'][maxIndex];
      }

      console.log("Interpreted result:", result);
      console.log("Confidence:", confidence);

      if (confidence < 0.7) {
        result = 'INVALID';
      }

      setPrediction(result);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ my: 4, p: 3, backgroundColor: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            AI วิเคราะห์โรคปอดอักเสบจากภาพเอ็กซ์เรย์ปอด
          </Typography>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current.click()}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  อัพโหลดภาพเอกซเรย์ปอด
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={analyzeImage}
                  disabled={!image || loading || !model}
                  fullWidth
                >
                  วิเคราะห์
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {image ? (
                  <img src={image} alt="Uploaded X-ray" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    ยังไม่มีภาพที่อัพโหลด
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {prediction && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h5" color={prediction === 'NORMAL' ? 'primary' : (prediction === 'PNEUMONIA' ? 'secondary' : 'text.primary')}>
                ผลการวิเคราะห์: {prediction}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {prediction === 'NORMAL'
                  ? 'ไม่พบความผิดปกติของปอด'
                  : prediction === 'PNEUMONIA'
                    ? 'พบความเสี่ยงของโรคปอดอักเสบ ควรปรึกษาแพทย์เพื่อการวินิจฉัยที่แม่นยำ'
                    : 'ไม่สามารถวิเคราะห์ได้ กรุณาอัพโหลดภาพเอกซเรย์ปอดที่ชัดเจน'}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default XRayAnalysis;