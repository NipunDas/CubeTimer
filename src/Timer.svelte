<script lang="ts">
	import { timeStore, timing } from "./TimeStore";
	import type { TimeEntry } from "./TimeStore";

	let time = "0";
	let startDate: Date; // To calculate total time
	let interval: number; // To keep track of the interval that does the timing
	let keyDown = false; // To avoid key press repeats

	let timeColor = "black"; // green if ready to time, black otherwise

	/* Key down input: If timing is true, then regardless of what key is pressed,
	   you want to stop timing (makes it easy to stop the timer in situations like
	   blind events, etc.). The timing boolean is intentionally not set to false
	   so that when the key is lifted after the timing has stopped, the timer isn't
	   started again. If timing is not true, then check if the user is pressing the
	   space bar. If so, indicate that the timer is ready to time (set the display
	   time to 0 and make the time green).*/
	function handleKeyDown(event: KeyboardEvent) {
		if (!keyDown) {
			if ($timing) {
				// Stop timing at current time
				time = ((new Date().getTime() - startDate.getTime()) / 1000).toFixed(2);
				clearInterval(interval);

				// Construct new time entry with current time, ao5, and ao12
				let newEntry: TimeEntry = {
					time: time,
					ao5: calculateAverage(5),
					ao12: calculateAverage(12)
				};

				timeStore.pushTimeEntry(newEntry);
				// gen new scramble?
			} else if (event.key === " ") {
				// Indicate that timer is ready to time
				time = "0";
				timeColor = "green";
				// make scramble disappear (ideally)
			}
			keyDown = true; // To prevent repeat KeyDown events
		}
	}

	/* Key up input: If timing is false and space key is lifted, then start timing by
	   recording the start time and setting an interval to update the current time.
	   Set the timing boolean to true and change the time display's color to black.
	   Otherwise, if timing is true, then set it to false to indicate that timing is
	   no longer occurring. */
	function handleKeyUp(event: KeyboardEvent) {
		if (keyDown) {
			if (event.key === " " && !$timing) {
				// Record starting time
				startDate = new Date();
				// Interval to update time dispaly, refreshes every 10 seconds
				interval = setInterval(() => {
					time = Math.trunc(
						(new Date().getTime() - startDate.getTime()) / 1000
					).toString();
				}, 10);
				$timing = true;
				timeColor = "black";
			} else if (timing) {
				$timing = false;
			}
			keyDown = false; // To prevent repeat KeyUp events
		}
	}

	function calculateAverage(count: number) {
		// need at least x numbers for an average of x
		if ($timeStore.length < count - 1) {
			return "-";
		}

		// we're taking the last x - 1 numbers from the array, and convert to an array of numbers
		// it's x - 1 because the current time isn't added to the array yet, so we'll add it manually
		let timeSubArray = $timeStore.slice($timeStore.length - count + 1);
		let timeNums: number[] = [Number(time)];

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
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<h1 style="color: {timeColor}">
	{time}
</h1>

<style>
	@font-face {
		font-family: "digital-clock-font";
		src: url("fonts/digital-7.ttf");
	}

	h1 {
		font-family: "digital-clock-font";
		text-align: center;
		font-size: 10em;
	}
</style>
