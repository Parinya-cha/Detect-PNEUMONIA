import React, { useState, useRef } from 'react';
import {
    Button, Container, Typography, Box, CircularProgress,
    Paper, Grid, Snackbar, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    const [error, setError] = useState(null);

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
        if (!image) return;

        setLoading(true);
        try {

            const response = await fetch(image);
            const blob = await response.blob();


            const formData = new FormData();
            formData.append('file', blob, 'image.jpg');


            const apiResponse = await fetch(
                "https://classify.roboflow.com/new-qncgi/1?api_key=KtIshQJodUwSOazl1r7M",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await apiResponse.json();
            console.log("API response:", result);


            if (result.predictions && result.predictions.length > 0) {
                const topPrediction = result.predictions[0];
                // ตรวจสอบและแก้ไขค่าที่ไม่ถูกต้อง ตอนเทรนผม ใส่คลาสเป็น NOMAL ลืมใส่ R 55555
                setPrediction(topPrediction.class === 'NOMAL' ? 'NORMAL' : topPrediction.class);
            } else {
                throw new Error('No predictions received from API');
            }
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
                                    disabled={!image || loading}
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
                            <Typography variant="h5" color={prediction === 'NORMAL' ? 'primary' : 'secondary'}>
                                ผลการวิเคราะห์: {prediction}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {prediction === 'NORMAL'
                                    ? 'ไม่พบความผิดปกติของปอด'
                                    : 'พบความเสี่ยงของโรคปอดอักเสบ ควรปรึกษาแพทย์เพื่อการวินิจฉัยที่แม่นยำ'}
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