import React from 'react';
import Button from '@mui/material/Button';
import { createCatExam } from '../api'


const Main = () => {

    return (
        <>
            <h3 id="title">Entrance test</h3>
            <Button
                onClick={() => {
                    createCatExam()
                        .then((res) => {
                            localStorage.setItem('catIndex', res.data.data.cat_index);
                        });
                }}
            >
                Create CAT Test {localStorage.getItem('catIndex')}
            </Button>
        </>
    )
};

export default Main;