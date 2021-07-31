import { MdDeleteForever } from 'react-icons/md'; 
import {BiEdit} from 'react-icons/bi'; 
import { MdSearch } from "react-icons/md";
import { useEffect, useState } from 'react';
import { nanoid } from "nanoid";

const Notes = () => {

    const charLimit = 500

    const [inputData, setInputData] = useState("");
    const [notes, setNotes] = useState([]);
    const [isEditNote, setIsEditNote] = useState("");
    const [editButton, setEditButton] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem('react-notes-app-data'));
        if(savedNotes) {
          setNotes(savedNotes);
        }
      }, [])
    
      useEffect(() => {
        localStorage.setItem('react-notes-app-data', JSON.stringify(notes))
      }, [notes])
    

    const addNote = () => {
   
        if(!inputData) {
            alert("plz fill it")
        }
        else if(editButton && inputData){
            setNotes(notes.map((curEle) => {
                if(curEle.id === isEditNote){
                    return{...curEle , text:inputData}
                }
                return curEle;
            }));
            setInputData("");
            setEditButton(false);
            setIsEditNote(null);
        }
        else if(inputData.trim().length > 0){

            const date = new Date();
            const newNote = {
                id: nanoid(),
                text: inputData,
                date: date.toLocaleDateString('en-GB')
            }
            setNotes([...notes , newNote]);
            setInputData("");
        }
    }

    const handleChange = (event) => {
        if(charLimit-event.target.value.length >=0 ){
            setInputData(event.target.value);
        }
        // eslint-disable-next-line
    }


    const deleteNote = (id) => {
        const UpdatedNotes = notes.filter((curEle) => {
            return (curEle.id !== id)
        });
        setNotes(UpdatedNotes);
    }

    const removeAll = (index) => {
        setNotes([]);
    }

    const editNote = (id) => {
        const notes_edited = notes.find((curEle)=>{
            return (curEle.id === id)
        });
        setInputData(notes_edited.text);
        setIsEditNote(id);
        setEditButton(true);
    }

    return (
        <>
            <div className={`${darkMode && 'dark-mode'}`}>

                <div className="container">

                    <div className="header">
                        <h1>Notes</h1>
                        <div className="headerbutton">
                            <button className='save' onClick={()=> setDarkMode((previousDarkMode)=>!previousDarkMode)}>Toggle Mode</button>
                            <button className='save' onClick={removeAll}>Remove All</button>
                        </div>
                    </div>

                    <div className="search">
                        <MdSearch className="search-icon" size="1.3em" />
                        <input type="text" placeholder="Type to search" onChange={(event)=>setSearchText(event.target.value)}/>
                    </div>

                    <div className="noteslist">
                        {notes.filter((note)=> note.text.toLowerCase().includes(searchText.toLowerCase())).map((curEle)=> {
                            return(

                                <div className='note' key={curEle.id}>
                                    <span>{curEle.text}</span>
                                    <div className="note-footer">
                                        <small>{curEle.date}</small>
                                        <div className="editdeletebtn">
                                            <BiEdit className="edit-icon" size='1.3em' onClick={()=> editNote(curEle.id)} />
                                            <MdDeleteForever className="delete-icon" size='1.3em' onClick={()=> deleteNote(curEle.id)}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="note new">
                            <textarea rows="8" cols="10" placeholder="Add a New Note..." value={inputData} onChange={(event)=> setInputData(event.target.value)} onChange={handleChange}></textarea>
                            <div className="note-footer">
                                <small>{charLimit - inputData.length} Remaining.....</small>
                                <button className="save" onClick={addNote}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Notes
