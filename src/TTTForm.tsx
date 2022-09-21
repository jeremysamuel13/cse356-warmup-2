import React from 'react';
import "./TTTForm.css"

const TTTForm = () =>
    <div className='ttt-form-div'>
        <form action="/ttt" method="get">
            <label htmlFor="name">{'Name: '}
                <input type="text" id="name" name="name" />
            </label>
            <input type="submit" value="Submit"></input>
        </form>
    </div>

export default TTTForm;