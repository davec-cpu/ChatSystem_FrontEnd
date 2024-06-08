import React, { useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';

const Login = ({ login }) => {
    const [userEmail, setUserEmail] = useState();
    const [data, setData] = useState();
    const navigate = useNavigate();

    const checkflag = (flag) => {
        if (flag == false) {
            window.setTimeout(checkflag(), 100)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        let userid = 0;
        switch (userEmail) {
            case 'greenhighpeach@gmail.com':
                userid = 0;
                break;
            case 'linhpearl@gmail.com':
                userid = 1;
                break;
            case 'huynguyen2210@gmail.com':
                userid = 3;
                break;
            case 'hanh21B22@gmail.com':
                userid = 2;
                break;
            case 'chichichanhchanh11@gmail.com':
                userid = 4;
                break;
            case 'highskywind11@gmail.com':
                userid = 5;
                break;
            default:
                userid = 0;
        }
        await login(userid)
        const navigateFunc = () => {
            navigate('/home/'.concat(userid));
        }
        navigateFunc();
        axios.get('https://localhost:7028/'.concat(userid))
            .then(res => {
                setData(res.data)
            })
            .catch(err => console.error(err))
    }

    const changeHanler = (e) => {
        setUserEmail(e.target.value)
    }
    return (
        <div className='px-5'>
            <Form onSubmit={handleSubmit} className='mt-5'>
                {/* <Col sm={12}> */}
                <Form.Group>
                    <Form.Control placeholder='Email...' type='text' className='d-flex p-2' onChange={changeHanler} />
                    <Button variant='success' type='submit' >Join</Button>
                </Form.Group>
                {/* </Col> */}
            </Form>
        </div>
    )
}

export default Login
