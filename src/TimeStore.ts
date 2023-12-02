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
			update((timeArray: TimeEntry[]) => {
				/* Update method pushes new time entry and calculates/includes
				   ao5 and ao12 in the newest entry */
				timeArray.push(timeEntry);
				
				let ao5 = calculateAverage(timeArray, 5, timeArray.length - 5);
				let ao12 = calculateAverage(timeArray, 12, timeArray.length - 12);

				timeArray[timeArray.length - 1].ao5 = ao5;
				timeArray[timeArray.length - 1].ao12 = ao12;
				return timeArray;
			}),
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


// Function to calculate averages for each TimeEntry
function calculateAverage(timeArray: TimeEntry[], count: number, startIndex: number) {
	// need at least x numbers for an average of x
	if (count + startIndex > timeArray.length || startIndex < 0) {
		return "-";
	}

	// we're taking the last x numbers from the array, and convert to an array of numbers
	let timeSubArray = timeArray.slice(startIndex, startIndex + count);
	let timeNums: number[] = [];

	timeSubArray.forEach((timeEntry) => {
		timeNums.push(Number(timeEntry.time));
	});

	timeNums.sort();

	// general rule for finding aoX is to exclude the top and bottom 5% of times
	// there are x - 2(margin) counting times, for ex. an ao5 has 3 counting times
	let excludeMargin = Math.ceil(count * 0.05);
	let totalCountingTimes = count - 2 * excludeMargin;
	let sum = 0;

	for (let i = excludeMargin; i < timeNums.length - excludeMargin; i++) {
		sum += timeNums[i];
	}

	return (sum / totalCountingTimes).toFixed(2);
}
