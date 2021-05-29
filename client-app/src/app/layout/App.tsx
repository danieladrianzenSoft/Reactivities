import React, { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();
  // Get data from API. Use useState hook with name of variable
  // where we're going to store state, and function called to 
  // set the state. Set initial state of emtpy array.

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])
    // add array of dependencies (here empty) to make sure that useEffect
    // only runs one time. useEffect is a hook that fetches data from 
    // server. If it runs, it will set a change to activities, causing 
    // a re-render. in turn that acses activities to change, and it will 
    // re-render again. thus we need to send in an emtpy array of
    // dependencies to prevent this.

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
