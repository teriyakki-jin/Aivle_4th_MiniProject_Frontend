import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    도서 관리 시스템
                </Typography>
                <Button color="inherit" onClick={() => navigate('/books')}>
                    도서 목록
                </Button>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
}
