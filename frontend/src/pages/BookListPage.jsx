// src/pages/BookListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Box,
    Stack,
    Chip,
    Alert,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../app/axios";

const MOCK_BOOKS = [
    {
        bookId: "mock-1",
        title: "프론트엔드 실전 핸드북",
        author: "김코드",
        category: "프로그래밍",
        //coverUrl:
        //     "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80",
    },
    {
        bookId: "mock-2",
        title: "데이터 과학으로 하는 의사결정",
        author: "이분석",
        category: "데이터",
        //coverUrl:
        //    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80",
    },
    {
        bookId: "mock-3",
        title: "클린 코드 여정",
        author: "박정리",
        category: "소프트웨어 공학",
        coverUrl:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=500&q=80",
    },
    {
        bookId: "mock-4",
        title: "AI Product Design",
        author: "Alice Kim",
        category: "UX/UI",
        coverUrl:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80",
    },
    {
        bookId: "mock-5",
        title: "서버리스 첫걸음",
        author: "최백엔드",
        category: "클라우드",
        coverUrl:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80",
    },
];

function BookListPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(""); // 에러 메시지
    const [usingMock, setUsingMock] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [categoryKeyword, setCategoryKeyword] = useState("전체");

    const categoryOptions = useMemo(
        () => [
            "전체",
            "프로그래밍",
            "데이터",
            "소프트웨어 공학",
            "UX/UI",
            "클라우드",
        ],
        []
    );

    async function fetchBooks(keyword = "", categoryFilter = "") {
        try {
            // 검색 조건 없으면 그냥 전체 조회
            const params = {};
            if (keyword) params.keyword = keyword;
            if (categoryFilter) params.category = categoryFilter;
            const res = await api.get("/books", { params });

            // API 스펙: { status, message, data: [...] }
            setBooks(res.data.data || []);
            setError("");
            setUsingMock(false);
        } catch (e) {
            // 404, 500 경우에 message 내려줄 거라 그거 사용
            const msg = e.response?.data?.message || "도서 목록을 불러오지 못했습니다.";
            setError(msg);
            const keywordLower = keyword.toLowerCase();
            const categoryLower = categoryFilter.toLowerCase();
            const filteredMock = MOCK_BOOKS.filter((book) => {
                const matchesKeyword = keyword
                    ? book.title?.toLowerCase().includes(keywordLower) ||
                      book.author?.toLowerCase().includes(keywordLower)
                    : true;
                const matchesCategory = categoryFilter
                    ? book.category?.toLowerCase().includes(categoryLower)
                    : true;
                return matchesKeyword && matchesCategory;
            });
            setBooks(filteredMock);
            setUsingMock(true);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = () => {
        setLoading(true);
        fetchBooks(searchKeyword.trim(), categoryKeyword === "전체" ? "" : categoryKeyword.trim());
    };

    const handleReset = () => {
        setSearchKeyword("");
        setCategoryKeyword("전체");
        setLoading(true);
        fetchBooks("");
    };

    useEffect(() => {
        fetchBooks("", "");
    }, []);

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" mb={2} gap={2}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        도서 목록
                    </Typography>
                    <Typography color="text.secondary">
                        최신 등록 도서들을 카드로 확인하고 바로 상세 페이지로 이동하세요.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/books/new")}
                    sx={{ alignSelf: "flex-start" }}
                >
                    신규 도서 등록
                </Button>
            </Stack>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                mb={2}
                alignItems="stretch"
            >
                <TextField
                    fullWidth
                    label="도서 검색"
                    placeholder="제목 또는 저자를 입력하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel id="book-category-label">카테고리</InputLabel>
                    <Select
                        labelId="book-category-label"
                        label="카테고리"
                        value={categoryKeyword}
                        onChange={(e) => setCategoryKeyword(e.target.value)}
                    >
                        {categoryOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={handleSearch} sx={{ minWidth: 96 }}>
                        검색
                    </Button>
                    <Button variant="text" color="inherit" onClick={handleReset} sx={{ minWidth: 96 }}>
                        초기화
                    </Button>
                </Stack>
            </Stack>

            {usingMock && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: 3 }}>
                    서버 연결이 어려워 준비된 샘플 데이터를 보여주고 있어요. 네트워크가 복구되면
                    다시 시도해 주세요.
                </Alert>
            )}
            {error && !usingMock && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() =>
                                fetchBooks(
                                    searchKeyword.trim(),
                                    categoryKeyword === "전체" ? "" : categoryKeyword.trim()
                                )
                            }
                        >
                            재시도
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            <Grid container spacing={2.5}>
                {books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.bookId}>
                        <Card
                            onClick={() => navigate(`/books/${book.bookId}`)}
                            sx={{
                                cursor: "pointer",
                                height: "100%",
                                borderRadius: 3,
                                border: "1px solid #e5e7eb",
                                transition: "all 0.2s ease",
                                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
                                '&:hover': {
                                    boxShadow: "0 16px 35px rgba(25, 118, 210, 0.18)",
                                    transform: "translateY(-3px)",
                                    borderColor: "#90caf9",
                                },
                            }}
                        >
                            {book.coverUrl ? (
                                <img
                                    src={book.coverUrl}
                                    alt="표지"
                                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: 200,
                                        display: "grid",
                                        placeItems: "center",
                                        background: "linear-gradient(180deg, #e3f2fd 0%, #f7fbff 100%)",
                                        color: "#1e88e5",
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    No Cover
                                </Box>
                            )}
                            <CardContent sx={{ display: "grid", gap: 1 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {book.author}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                        label={book.category || "카테고리 미정"}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {books.length === 0 && (
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                p: 3,
                                textAlign: "center",
                                borderRadius: 3,
                                border: "1px dashed #cbd5e1",
                                color: "text.secondary",
                                backgroundColor: "#f8fafc",
                            }}
                        >
                            아직 등록된 도서가 없습니다. 첫 번째 도서를 등록해 보세요!
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default BookListPage;
