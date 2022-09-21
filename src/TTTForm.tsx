import React from 'react';
import { useState, useEffect } from "react"
import { Players, TTTElement, TTTGrid, TTTRequest, TTTResponse, Winner } from "../server/src/interface"
import "./TTTBoard.css"


const TTTForm = () =>
    <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" /><br />
        <input type="submit" value="Submit"></input>
    </form>


export default TTTForm;