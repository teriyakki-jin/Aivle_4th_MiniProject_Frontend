
import { useEffect, useState } from 'react';
import { api } from '../app/axios';
import axios from 'axios';

export function useOpenAIChatAxios({ prompt, options = {}, auto = true }) {
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!auto) return;
        if (!prompt || !prompt.trim()) return;

        const controller = new AbortController(); // Axios v1은 AbortController 사용 가능
        setLoading(true);
        setError(null);
        setAnswer('');

        async function run() {
            try {
                const res = await api.post(
                    '/api/openai',
                    {
                        prompt,
                        model: options.model ?? 'gpt-4o-mini',
                        system: options.system ?? 'You are a helpful assistant.',
                        temperature: options.temperature ?? 0.7
                    },
                    {
                        signal: controller.signal,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                const text = res?.data?.choices?.[0]?.message?.content ?? '';
                setAnswer(text);
            } catch (e) {
                // 취소와 일반 오류 구분
                if (axios.isCancel(e) || e.name === 'CanceledError') {
                    // 취소된 경우는 에러로 처리하지 않음
                } else {
                    setError(e);
                }
            } finally {
                setLoading(false);
            }
        }

        run();

        return () => {
            controller.abort(); // 언마운트/의존성 변경 시 요청 취소
        };
    }, [prompt, auto, options.model, options.system, options.temperature]);

    return { loading, answer, error };
}
