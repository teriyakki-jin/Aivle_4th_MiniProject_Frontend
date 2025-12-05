// src/pages/BookListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import api from "../app/axios";

function BookListPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);   // 로딩 상태
    const [error, setError] = useState("");         // 에러 메시지

    async function fetchBooks() {
        try {
            // 검색 조건 없으면 그냥 전체 조회
            const res = await api.get("/books");

            // API 스펙: { status, message, data: [...] }
            setBooks(res.data.data || []);
        } catch (e) {
            // 404, 500 경우에 message 내려줄 거라 그거 사용
            const msg = e.response?.data?.message || "도서 목록을 불러오지 못했습니다.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                도서 목록
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/books/new")}
                sx={{ mb: 2 }}
            >
                신규 도서 등록
            </Button>

            <Grid container spacing={2}>
                {books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.bookId}>
                        <Card
                            onClick={() => navigate(`/books/${book.bookId}`)}
                            sx={{ cursor: "pointer" }}
                        >
                            {/* 백엔드에서 coverUrl 안 준다면 나중에 처리 */}
                            {book.coverUrl && (
                                <img
                                    src={book.coverUrl}
                                    alt="표지"
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{book.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {book.author} | {book.category}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default BookListPage;
