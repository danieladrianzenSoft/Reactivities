import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';

export default observer(function ActivityDashboard() {
	// Get data from API. Use useState hook with name of variable
	// where we're going to store state, and function called to 
	// set the state. Set initial state of emtpy array.
	const {activityStore} = useStore();
	const {loadActivities, activityRegistry} = activityStore;

	useEffect(() => {
		if (activityRegistry.size <= 1) loadActivities();
	  }, [activityRegistry.size, loadActivities])
		// add array of dependencies (here empty) to make sure that useEffect
		// only runs one time. useEffect is a hook that fetches data from 
		// server. If it runs, it will set a change to activities, causing 
		// a re-render. in turn that acses activities to change, and it will 
		// re-render again. thus we need to send in an emtpy array of
		// dependencies to prevent this.

	if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

	return (
		<Grid>
			<Grid.Column width='10'>
				<ActivityList />
			</Grid.Column>
			<Grid.Column width='6'>
				<ActivityFilters />
			</Grid.Column>
		</Grid>
	)
})