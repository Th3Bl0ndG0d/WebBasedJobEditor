import React from 'react';
import './NotFound.css';
import FormGrid from '../../components/formGrid/FromGrid.jsx';
import FormGroup from '../../components/formGroup/formGroup.jsx';
import Button from '../../components/button/Button.jsx';
import {Link, useNavigate} from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="outer-container notfound-wrapper">
            <div className="inner-container notfound-card">
                <div className="form-card notfound-card">
                    <FormGrid direction="column" theme="light" layout="centered">
                        <FormGroup label=" ">
                            <h1>404</h1>
                        </FormGroup>

                        <FormGroup label=" ">
                            <h2>Oeps... Deze pagina bestaat niet</h2>
                        </FormGroup>

                        <FormGroup label=" ">
                            <p>Controleer het adres of keer terug naar de homepage.</p>
                        </FormGroup>

                        <FormGroup label=" " className="centered">
                            <Button
                                type="button"
                                onClick={() => navigate('/')}
                                label="Home"
                                variant="normal"
                            />
                        </FormGroup>
                    </FormGrid>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
