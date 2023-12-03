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

				/* Construct new time entry with current time, ao5, and ao12.
				   The pushTimeEntry() method for timeStore calculates the ao5/ao12
				   while pushing, so no need to calculate it here */
				let newEntry: TimeEntry = {
					time: time,
					ao5: "-",
					ao12: "-"
				};

				timeStore.pushTimeEntry(newEntry);
			} else if (event.key === " ") {
				// Indicate that timer is ready to time
				time = "0";
				timeColor = "green";
			}
			keyDown = true; // To prevent repeat KeyDown events
			console.log($timing);
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
				timing.set(true);
				timeColor = "black";
			} else if ($timing) {
				timing.set(false);
			}
			keyDown = false; // To prevent repeat KeyUp events
			console.log($timing);
		}
	}
</script>

<svelte:window
	on:keydown|preventDefault={handleKeyDown}
	on:keyup={handleKeyUp}
/>

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
