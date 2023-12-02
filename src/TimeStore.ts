import { writable } from "svelte/store";

/* TimeEntry is an interface representing what each time "entry" should be, it
   currently contains the current time and the ao5 and ao12 for the last 5/12
   times, including the time within the current time entry */
interface TimeEntry {
	time: string;
	ao5: string;
	ao12: string;
}

/* A timeStore is a custom Svelte store that allows for the array of time
   entries to be shared between different components. The subscribe method
   is included to enable automatic subscription in the components where the
   store is imported, and the other methods wrap around update() and set() to
   make it easy to do things like adding a new entry or deleting an entry by
   its index */
function createTimeStore() {
	const { subscribe, set, update } = writable<TimeEntry[]>([]);

	return {
		subscribe,
		pushTimeEntry: (timeEntry: TimeEntry) =>
			// using ES spread operator to add new TimeEntry to the store
			update((timeArray: TimeEntry[]) => [...timeArray, timeEntry]),
		deleteTimeEntry: (index: number) =>
			update((timeArray: TimeEntry[]) => {
				// splice method removes TimEntry at provided index
				timeArray.splice(index, 1);
				return timeArray;
			}),
		resetTimes: () => set([]) // reset times by setting array to empty
	};
}

export const timeStore = createTimeStore();
// timing keeps track of whether the timer is currently timing
export const timing = writable<boolean>(false);
export type { TimeEntry };
