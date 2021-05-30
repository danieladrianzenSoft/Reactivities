import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { format } from "date-fns";

export default class ActivityStore {
	activityRegistry = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = false;
	loadingInitial = false;

	constructor(){
		makeAutoObservable(this)
	}

	get activitiesByDate(){
		return Array.from(this.activityRegistry.values()).sort((a, b) => 
			a.date!.getTime() - b.date!.getTime());
	}

	get groupedActivities(){
		// get array of objects (activities), each with a key, which is the
		// activity date, and for each date we have an array of activities
		// inside. Assign activities with matching dates to activities array
		// otherwise create a new array with the activity.
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				// square brackets: object property accessor. 
				// const date = activity.date!.toISOString().split('T')[0];
				const date = format(activity.date!, 'dd MMM yyyy');
				activities[date] = activities[date] ? [...activities[date], activity] : [activity]
				return activities;
			}, {} as {[key: string]: Activity[]})
		)
	}

	loadActivities = async () => {
		this.loadingInitial = true;
		try {
			const activities = await agent.Activities.list();
			activities.forEach((activity) => {
				this.setActivity(activity);
			});
			this.setLoadingInitial(false);
		} catch (error) {
			console.log(error);
			this.setLoadingInitial(false);
		}
	}

	loadActivity = async (id: string) => {
		let activity = this.getActivity(id);
		if (activity){
			this.selectedActivity = activity;
			return activity;
		} else {
			this.loadingInitial = true;
			try {
				activity = await agent.Activities.details(id);
				this.setActivity(activity);
				runInAction(() => {
					this.selectedActivity = activity;
				})
				this.setLoadingInitial(false);
				return activity;
			} catch (error) {
				console.log(error);
				this.setLoadingInitial(false);
			}
		}
	}

	private getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	}

	private setActivity = (activity: Activity) => {
		activity.date = new Date(activity.date!);
		this.activityRegistry.set(activity.id, activity);
	}

	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	}

	createActivity = async (activity: Activity) => {
		this.loading = true;
		try {
			await agent.Activities.create(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
				this.loading = false;
			})
		} catch (error) {
			console.log(error);
			runInAction(()=>{
				this.loading = false;
			})
		}
	}

	updateActivity = async (activity: Activity) => {
		this.loading = true;
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				// Use '...' to loop over our existing activities,
    			// create new array filtering out activity and
				// adding updated activity.
				// this.activities = [...this.activities.filter(x => x.id !== activity.id), activity];
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
				this.loading = false;
			})
		} catch (error) {
			runInAction(() => {
				this.loading = false;
			})
		}
	}

	deleteActivity = async (id: string) => {
		this.loading = true;
		try {
			await agent.Activities.delete(id);
			runInAction(() => {
				// this.activities = [...this.activities.filter(x => x.id !== id)];
				this.activityRegistry.delete(id);
				this.loading = false;
			})
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.loading = false;
			})
		}
	}

}