import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { getExamId } from '../api'


const Main = () => {
    let [examId, setExamId] = useState(null)

    return (
        <>
            <h3 id="title">Entrance test</h3>
            <Button
                onClick={() => {
                    getExamId()
                        .then((res) => {
                            localStorage.setItem('exam_id', res.data.data.exam_id);
                            setExamId(res.data.data.exam_id)
                        });
                }}
            >
                Current Exam ID: {examId}
            </Button>
        </>
    )
};

export default Main;