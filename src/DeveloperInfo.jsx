import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function DeveloperInfo() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ my: 4, p: 3, backgroundColor: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          เกี่ยวกับผู้พัฒนา
        </Typography>
        <Box sx={{ my: 2 }}>
          <Typography variant="body1" paragraph>
            สวัสดีครับ ผมชื่อ นายปริญญา ชาบุญเรือง และ พชร สายไทย
          </Typography>
          <Typography variant="body1" paragraph>
            โปรเจกต์นี้เป็นส่วนหนึ่งของรายวิชา Digital image Processing โดยมีจุดประสงค์เพื่อพัฒนาเครื่องมือช่วยในการวินิจฉัยโรคปอดอักเสบจากภาพเอกซเรย์
          </Typography>
          {/* <Typography variant="body1" paragraph>
           
          </Typography> */}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button component={Link} to="/" variant="contained" color="primary">
            กลับสู่หน้าหลัก
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default DeveloperInfo;