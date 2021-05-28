import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  // Get data from API. Use useState hook with name of variable
  // where we're going to store state, and function called to 
  // set the state. Set initial state of emtpy array.
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:5001/api/activities').then(response => {
      console.log(response);
      setActivities(response.data);
    })
  }, [])
    // add array of dependencies (here empty) to make sure that useEffect
    // only runs one time. useEffect is a hook that fetches data from 
    // server. If it runs, it will set a change to activities, causing 
    // a re-render. in turn that acses activities to change, and it will 
    // re-render again. thus we need to send in an emtpy array of
    // dependencies to prevent this.

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities'/>
      <List>
          {/* adding curly brackets will make code inside be javascript */}
          {/* map will loop through activities array */}
          { activities.map((activity:any) => (
            <List.Item key={activity.id}>
              {activity.title}
            </List.Item>
          ))}
      </List>
    </div>
  );
}

export default App;
