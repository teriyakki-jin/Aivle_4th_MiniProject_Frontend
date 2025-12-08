// src/pages/BookFormPage.jsx

// src/pages/BookFormPage.jsx
import {
    Container,
    TextField,
    Button,
    Typography,
    Stack,
    Paper,
    Divider,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    // NEW: 아래 두 개를 추가
    FormControlLabel,
    Switch,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // NEW: useEffect 추가
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

    // NEW: AI 관련 상태
    const [autoGenerate, setAutoGenerate] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // NEW: 프롬프트 생성 함수
    function buildPrompt({ title, author, category, description }) {
        // 한국어 안내 및 출력 제약을 프롬프트에 포함
        return `
다음 도서 메타데이터를 바탕으로 독자가 관심을 갖도록 한국어로 200~300자 내의 소개 문구를 작성해주고 이미지 생성 리턴해줘.
- 제목: ${title || "(미입력)"}
- 저자: ${author || "(미입력)"}
- 카테고리: ${category || "(미입력)"}
- 참고 설명: ${description || "(없음)"}

요구 사항:
- 핵심 가치를 2~3개로 압축해 설득력 있게 제시
- 과장/광고 문구는 지양, 정보 중심
- 문장부호와 띄어쓰기 정확히
    `.trim();
    }

    // NEW: useEffect로 자동 생성 (디바운스 + 취소 지원)
    useEffect(() => {
        if (!autoGenerate) return; // 토글이 켜진 경우만 동작
        if (!form.title?.trim() || !form.author?.trim()) return; // 최소 조건

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setAiLoading(true);
            setAiError(null);
            setAiSuggestion("");

            try {
                const prompt = buildPrompt(form);
                // 백엔드 프록시 라우트로 전송 (예: Express에서 /api/openai 구현)
                const res = await api.post(
                    "/api/openai",
                    {
                        prompt,
                        model: "gpt-4o-mini",
                        system: "You are a helpful assistant for Korean book blurbs.",
                        temperature: 0.7,
                    },
                    { signal: controller.signal }
                );

                const text = res?.data?.choices?.[0]?.message?.content ?? "";
                setAiSuggestion(text);
            } catch (e) {
                if (e.name !== "CanceledError") setAiError(e);
            } finally {
                setAiLoading(false);
            }
        }, 600); // 디바운스 600ms

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [autoGenerate, form.title, form.author, form.category, form.description]);

    // NEW: AI 제안을 description에 반영
    const applyAISummary = () => {
        if (!aiSuggestion) return;
        setForm((prev) => ({ ...prev, description: aiSuggestion }));
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
                // NEW: 원하면 아래처럼 AI 생성 결과를 함께 저장할 수도 있음
                aiSummary: aiSuggestion || undefined,
            });

            alert(res.data?.message || "도서가 성공적으로 등록되었습니다.");
            navigate("/books"); // 또는 상세 페이지 이동: `/books/${res.data.data.bookId}`
        } catch (e) {
            const msg = e.response?.data?.message || "도서 등록 중 오류가 발생했습니다.";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
                    backgroundColor: "#fff",
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h4" fontWeight={800}>
                        신규 도서 등록
                    </Typography>
                    <Typography color="text.secondary">
                        도서 정보를 입력하면 목록에 자동으로 추가됩니다. 제목과 저자 정보를 잊지 말고 입력해 주세요.
                    </Typography>

                    {/* NEW: 자동 AI 생성 토글 */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={autoGenerate}
                                onChange={(e) => setAutoGenerate(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="AI 소개 자동 생성"
                    />

                    {/* 기존 안내/절차 섹션 */}
                    <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ borderRadius: 3, background: "linear-gradient(135deg, #f8fbff, #eef2ff)" }}
                    >
                        아래 순서대로 입력하면 바로 등록할 수 있어요.
                    </Alert>
                    {/* ... (기존 List/Guide는 그대로 유지) */}
                </Stack>

                <Divider />

                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        label="도서 제목"
                        name="title"
                        variant="outlined"
                        fullWidth
                        required
                        value={form.title}
                        onChange={handleChange}
                        helperText="필수 입력. 도서 표지나 카탈로그에 적힌 정식 제목을 입력하세요."
                    />
                    <TextField
                        label="저자"
                        name="author"
                        variant="outlined"
                        fullWidth
                        required
                        value={form.author}
                        onChange={handleChange}
                        helperText="필수 입력. 여러 명일 경우 쉼표로 구분하거나 주요 저자만 적어도 됩니다."
                    />
                    <TextField
                        label="카테고리"
                        name="category"
                        variant="outlined"
                        fullWidth
                        value={form.category}
                        onChange={handleChange}
                        helperText="예: 소설, 자기계발, 기술, 여행 등 (미입력 가능)"
                    />

                    {/* NEW: AI 제안 표시 영역 */}
                    {autoGenerate && (
                        <Stack spacing={1}>
                            <Typography variant="subtitle1" fontWeight={700}>
                                AI 소개 (자동 생성)
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={aiSuggestion}
                                placeholder={aiLoading ? "생성 중..." : "자동 생성된 소개가 여기에 표시됩니다."}
                                InputProps={{ readOnly: true }}
                            />
                            {aiError && (
                                <Alert severity="error">
                                    {aiError.response?.data?.detail?.message || aiError.message}
                                </Alert>
                            )}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={applyAISummary}
                                    disabled={!aiSuggestion}
                                >
                                    소개에 적용
                                </Button>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    onClick={() => setAiSuggestion("")}
                                >
                                    초기화
                                </Button>
                            </Stack>
                        </Stack>
                    )}

                    <TextField
                        label="내용 소개"
                        name="description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="줄거리, 특징, 메모 등을 자유롭게 작성하세요."
                        helperText="200~400자 내외로 간단히 적으면 가독성이 좋아요."
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
            </Paper>
        </Container>
    );
}
