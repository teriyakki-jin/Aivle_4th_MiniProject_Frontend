// src/pages/BookFormPage.jsx
import { Container, TextField, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../app/axios";

export default function BookFormPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        author: "",
        category: "",
        description: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.title || !form.author) {
            alert("제목과 저자는 필수입니다.");
            return;
        }

        try {
            setSubmitting(true);

            const userId = localStorage.getItem("userId") || "TEMP_USER_ID"; // 나중에 로그인 연동
            const res = await api.post("/books", {
                userId,
                ...form,
            });

            alert(res.data?.message || "도서가 성공적으로 등록되었습니다.");
            navigate("/books"); // 또는 상세 페이지로 이동하고 싶으면 `/books/${res.data.data.bookId}`
        } catch (e) {
            const msg = e.response?.data?.message || "도서 등록 중 오류가 발생했습니다.";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                신규 도서 등록
            </Typography>

            <Stack spacing={3}>
                <TextField
                    label="도서 제목"
                    name="title"
                    variant="outlined"
                    fullWidth
                    required
                    value={form.title}
                    onChange={handleChange}
                />
                <TextField
                    label="저자"
                    name="author"
                    variant="outlined"
                    fullWidth
                    required
                    value={form.author}
                    onChange={handleChange}
                />
                <TextField
                    label="카테고리"
                    name="category"
                    variant="outlined"
                    fullWidth
                    value={form.category}
                    onChange={handleChange}
                />
                <TextField
                    label="내용 소개"
                    name="description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                />

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "등록 중..." : "등록하기"}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={() => navigate("/books")}
                    >
                        취소
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
}
