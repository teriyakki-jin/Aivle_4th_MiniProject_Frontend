// src/pages/BookDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../app/axios";

export default function BookDetailPage() {
    const { id } = useParams(); // /books/:id
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchBook() {
        try {
            const res = await api.get(`/books/${id}`);
            setBook(res.data.data);
        } catch (e) {
            const msg = e.response?.data?.message || "도서 정보를 불러오지 못했습니다.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBook();
    }, [id]);

    if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!book) return <div style={{ padding: 20 }}>책을 찾을 수 없습니다.</div>;

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                {book.coverUrl && (
                    <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{ width: "100%", borderRadius: "4px", marginBottom: "20px" }}
                    />
                )}

                <Typography variant="h4" gutterBottom>
                    {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {book.author} | {book.category}
                </Typography>

                <Typography variant="body1" paragraph sx={{ marginTop: 2 }}>
                    {book.description}
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate("/books")}
                    sx={{ marginTop: 2 }}
                >
                    목록으로
                </Button>
            </Paper>
        </Container>
    );
}
