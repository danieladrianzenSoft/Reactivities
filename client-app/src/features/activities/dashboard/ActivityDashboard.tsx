import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

export default observer(function ActivityDashboard() {
	// Get data from API. Use useState hook with name of variable
	// where we're going to store state, and function called to 
	// set the state. Set initial state of emtpy array.
	const {activityStore} = useStore();
	const {loadActivities, activityRegistry, setPagingParams, pagination} = activityStore;
	const [loadingNext, setLoadingNext] = useState(false);

	function handleGetNext() {
		setLoadingNext(true);
		setPagingParams(new PagingParams(pagination!.currentPage + 1));
		loadActivities().then(() => setLoadingNext(false));
	}

	useEffect(() => {
		if (activityRegistry.size <= 1) loadActivities();
	  }, [activityRegistry.size, loadActivities])
		// add array of dependencies (here empty) to make sure that useEffect
		// only runs one time. useEffect is a hook that fetches data from 
		// server. If it runs, it will set a change to activities, causing 
		// a re-render. in turn that acses activities to change, and it will 
		// re-render again. thus we need to send in an emtpy array of
		// dependencies to prevent this.

	return (
		<Grid>
			<Grid.Column width='10'>
				{activityStore.loadingInitial && !loadingNext ? (
					<>
						<ActivityListItemPlaceholder />
						<ActivityListItemPlaceholder />
					</>
				) : (
					<InfiniteScroll
						pageStart={0}
						loadMore={handleGetNext}
						hasMore={!loadingNext && !!pagination &&
							pagination.currentPage < pagination.totalPages}
						initialLoad={false}
					>
						<ActivityList />
					</InfiniteScroll>
				)}
				
			</Grid.Column>
			<Grid.Column width='6'>
				<ActivityFilters />
			</Grid.Column>
			<Grid.Column width={10}>
				<Loader active={loadingNext} />
			</Grid.Column>
		</Grid>
	)
})