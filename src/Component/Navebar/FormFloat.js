import React from 'react'
import "./FormFloat.css"
import { IoMdClose } from "react-icons/io";
// import ContactForm from '../ContactForm/ContactForm';

const FormFloat = (props) => {
    return (
        <div className='formfloat'>
            <div className='formfloat-main'>
                <div className="floatform-card">
                    <div className="formfloat-button">
                        <IoMdClose onClick={props.formIsClose} />
                    </div>
                    {/* <ContactForm/> */}
                </div>
            </div>
        </div>
    )
}

export default FormFloat