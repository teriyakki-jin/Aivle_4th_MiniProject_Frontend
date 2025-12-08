import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Stack,
    Divider,
    Box,
    Chip,
    Alert,
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError('이메일과 비밀번호를 모두 입력해 주세요.');
            return;
        }

        try {
            setLoading(true);
            // API 호출 예시
            // const res = await api.post('/auth/login', form);
            // localStorage.setItem('token', res.data.token);
            // localStorage.setItem('userId', res.data.userId);

            // 임시 로그인 처리
            localStorage.setItem('userId', 'TEMP_USER_ID');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 8 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 16px 38px rgba(15, 23, 42, 0.1)',
                    backgroundColor: '#fff',
                }}
            >
                <Stack spacing={3}>
                    {/* 헤더 영역 */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 3,
                                backgroundColor: '#e8f3ff',
                                color: '#1e88e5',
                                display: 'grid',
                                placeItems: 'center',
                                margin: '0 auto',
                                mb: 2,
                            }}
                        >
                            <LibraryBooksOutlinedIcon sx={{ fontSize: 36 }} />
                        </Box>
                        <Chip
                            label="Aivle Library"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600, mb: 1.5 }}
                        />
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            로그인
                        </Typography>
                        <Typography color="text.secondary">
                            팀 도서 관리 시스템에 오신 것을 환영합니다
                        </Typography>
                    </Box>

                    <Divider />

                    {/* 에러 메시지 */}
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* 로그인 폼 */}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="이메일"
                                name="email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                autoComplete="email"
                            />
                            <TextField
                                label="비밀번호"
                                name="password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                required
                                value={form.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={loading}
                                startIcon={<LoginOutlinedIcon />}
                                sx={{ py: 1.5 }}
                            >
                                {loading ? '로그인 중...' : '로그인'}
                            </Button>
                        </Stack>
                    </form>

                    <Divider>
                        <Typography variant="body2" color="text.secondary">
                            또는
                        </Typography>
                    </Divider>

                    {/* 추가 액션 */}
                    <Stack spacing={1.5}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            fullWidth
                            onClick={() => navigate('/signup')}
                        >
                            회원가입
                        </Button>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate('/forgot-password')}
                            sx={{ textTransform: 'none' }}
                        >
                            비밀번호를 잊으셨나요?
                        </Button>
                    </Stack>

                    {/* 안내 메시지 */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            backgroundColor: 'rgba(248, 250, 252, 0.65)',
                            borderColor: '#e5e7eb',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            💡 계정이 없으시다면 회원가입 후 팀 도서관의 모든 기능을 이용하실 수 있습니다.
                        </Typography>
                    </Paper>
                </Stack>
            </Paper>

            {/* 하단 링크 */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                    variant="text"
                    onClick={() => navigate('/')}
                    sx={{ textTransform: 'none' }}
                >
                    ← 홈으로 돌아가기
                </Button>
            </Box>
        </Container>
    );
}