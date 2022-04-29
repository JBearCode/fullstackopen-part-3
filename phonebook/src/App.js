import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [personsToDisplay, setPersonsToDisplay] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterBy, setFilterBy] = useState('')
  const [notificationText, setNotificationText] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  useEffect(() => {
    console.log('effect begins')
    personsService
        .getAll()
        .then(response => {
          setPersons(response.data)
          setPersonsToDisplay(response.data)
      })
  }, [])

  const checkForDuplicate = (name) => persons.map(ob => ob.name).includes(name)

  const addPerson = (event) => {
    event.preventDefault()
    const numberObject = {
      name: newName,
      number: newNumber,
    }
    if (checkForDuplicate(numberObject.name)) {
      if (window.confirm(`${numberObject.name} is already in the phonebook! Would you like to update their number?`)) {
        const originalPerson = persons.find(p => p.name === numberObject.name)
        personsService
          .update(originalPerson.id, numberObject)
          .then(response => {
            setPersons(persons.map(p => p.id !== originalPerson.id ? p : response.data ))
            setPersonsToDisplay(personsToDisplay.map(p => p.id !== originalPerson.id ? p : response.data ))
            setNotificationColor("blue")
            setNotificationText(`Successfully updated number for contact ${numberObject.name}`)
            setTimeout(() => {
              setNotificationText(null)
            }, 5000)
          })
          .catch(errorMessage => {
            setNotificationColor("red")
            setNotificationText(`Contact ${numberObject.name} has already been deleted from the server!`)
            setTimeout(() => {
              setNotificationText(null)
            }, 5000)  
            setPersons(persons.filter(p => p.id !== originalPerson.id))
            setPersonsToDisplay(personsToDisplay.filter(p => p.id !== originalPerson.id))
          })

      }
      setNewName('');
      setNewNumber('');
    } else {
      personsService
        .create(numberObject)
        .then(response => {
          console.log(response)
          setPersonsToDisplay(persons.concat(response.data))
          setPersons(persons.concat(response.data))        
      })
      setNotificationColor("green")
      setNotificationText(`Successfully created new contact ${numberObject.name}`)
      setTimeout(() => {
        setNotificationText(null)
      }, 5000)    
      setNewName('');
      setNewNumber('');
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (value) => {
    setFilterBy(value);
    console.log(value);
    if (!value) {
      setPersonsToDisplay(persons)
    } else {
      setPersonsToDisplay(persons.filter(person =>
      person.name.toLowerCase().includes(filterBy.toLowerCase()) === true
    ));}
  }

  const handleDeleteClick = (person) => {
    console.log(`ID ${person.id} must be deleted`)
    if (window.confirm(`Do you want to delete your contact ${person.name}?`))
    personsService
      .deleteResource(person.id)
      .then(response => {
          personsService.getAll() 
          .then(response => {
            setPersons(response.data)
            setPersonsToDisplay(response.data)
          })
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationText} notificationColor={notificationColor}/>
      <Filter filterBy={filterBy} onChange={handleFilterChange}/>
      <h2>Add Contact</h2>
      <Form newName={newName} 
            handleNameChange={handleNameChange}
            newNumber={newNumber}
            handleNumberChange={handleNumberChange}
            addPerson={addPerson}
      />
      <Numbers personsToDisplay={personsToDisplay}
               handleDeleteClick={handleDeleteClick}
      />
    </div>
  )
}

const Numbers = ({personsToDisplay, handleDeleteClick}) => {
  return (
    <div>
    <h2>Numbers</h2>
    {personsToDisplay.map((person) => 
    <div key={person.id}>
      <span>{person.name} {person.number}</span>
      <button onClick={() => handleDeleteClick(person)}>Delete Contact</button>
    </div>
    )}
    </div>
  )
}

const Form = (props) => {
  return (
    <form onSubmit={props.addPerson}>
        <div>Name: <input type="text" value={props.newName} onChange={props.handleNameChange}/></div>
        <div>Number: <input type="number" value={props.newNumber} onChange={props.handleNumberChange}/></div>
        <div>
        <button type="submit">Add</button>
        </div>
    </form>
  )
}

const Filter = ({filterBy, onChange}) => {
  return (
    <div>Filter Contacts: <input 
      type="text" 
      value={filterBy} 
      onChange={(e) => onChange(e.target.value)}
    /></div>
  )
}

const Notification = ({ message, notificationColor }) => {
  const styleObject = {
    color: notificationColor,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return (
    <div className='notification' style={styleObject}>
      {message}
    </div>
  )
}


export default App