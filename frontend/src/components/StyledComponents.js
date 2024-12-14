import { styled } from '@mui/material/styles';
import {Box, Typography, Paper} from "@mui/material";

export const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'bottom',
    marginBottom: theme.spacing(1),
    color: '#5d4037',
  }));
  
export const StyledTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    display: "flex", 
  }));
  
export  const StyledPaper = styled(Paper)(({theme}) => ({
    elevation : 24,
    marginTop: 10,
    padding: 3,
    borderRadius: 10,
    border: '2px solid transparent',
    background: 'linear-gradient(to right, #e3f2fd, #bbdefb)', // Nền xanh nhạt hơn
    color: '#000', // Màu chữ tối hơn
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, transparent 75%, #90caf9 75%)', // Viền dịu nhẹ
      zIndex: -1,
    },
  }));