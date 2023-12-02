<script lang="ts">
	import "./css/main.css";
	import { Scrambow } from "scrambow";

	interface timeEntry {
		time: string;
		ao5: string;
		ao12: string;
	}

	let eventSelector: HTMLSelectElement;
	let resetButton: HTMLButtonElement;

	let time = "0";
	let startDate: Date;
	let interval: number;
	let timing = false;
	let keyDown = false;

	let timeArray: timeEntry[] = [];
	let timeColor = "black";
	let scrambleType = "333";
	$: scramble = new Scrambow().setType(scrambleType).get()[0].scramble_string;

	function handleKeyDown(event: KeyboardEvent) {
		if (!keyDown) {
			if (timing) {
				time = ((new Date().getTime() - startDate.getTime()) / 1000).toFixed(2);
				clearInterval(interval);

				let newEntry: timeEntry = {
					time: time,
					ao5: '-',
					ao12: '-',
				}

				timeArray = [...timeArray, newEntry];

				let ao5 = calculateAverage(5, timeArray.length - 5);
				let ao12 = calculateAverage(12, timeArray.length - 12);
				
				timeArray[timeArray.length - 1].ao5 = ao5;
				timeArray[timeArray.length - 1].ao12 = ao12;



				scramble = new Scrambow().setType(scrambleType).get()[0].scramble_string;
			} else if (event.key === " ") {
				time = "0";
				timeColor = "green";
				scramble = "";
			}
			keyDown = true;
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (keyDown) {
			if (event.key === " " && !timing) {
				startDate = new Date();
				interval = setInterval(() => {
					time = Math.trunc((new Date().getTime() - startDate.getTime()) / 1000).toString();
				}, 10);
				timing = true;
				timeColor = "black";
			} else if (timing) {
				timing = false;
			}
			keyDown = false;
		}
	}

	function resetTimes() {
		timeArray = [];
		time = "0";
		resetButton.blur();
	}

	function calculateAverage(count: number, startIndex: number) {
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

	function deleteEntry(index: number) {
		// delete the entry at index using array splice method
		console.log("deleting! ", index);
		console.log(timeArray.length);
		timeArray.splice(index, 1);
		timeArray = timeArray;
		console.log(timeArray.length);
	}
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
<h3>
	{scramble}
</h3>
<select
	on:change={() => {
		eventSelector.blur();
	}}
	bind:this={eventSelector}
	bind:value={scrambleType}
>
	<option value="333">3x3</option>
	<option value="222">2x2</option>
	<option value="444">4x4</option>
	<option value="555">5x5</option>
	<option value="666">6x6</option>
	<option value="777">7x7</option>
	<option value="333">3x3 OH</option>
	<option value="333fm">3x3 FMC</option>
	<option value="minx">Megaminx</option>
	<option value="pyram">Pyraminx</option>
	<option value="skewb">Skewb</option>
	<option value="sq1">Square-1</option>
	<option value="clock">Clock</option>
</select>
<h1 style="color: {timeColor}">
	{time}
</h1>
<div>
	<button on:click={resetTimes} bind:this={resetButton}> Reset Times </button>
	<table>
		<tr>
			<th> # </th>
			<th> Time </th>
			<th> ao5 </th>
			<th> ao12 </th>
			<th> Delete </th>
		</tr>
		{#each timeArray as { time, ao5, ao12 }, i (i)}
			<tr>
				<td>{i + 1}</td>
				<td>{time}</td>
				<td>{ao5}</td>
				<td>{ao12}</td>
				<td>
					<button on:click={() => deleteEntry(i)}> X </button>
				</td>
			</tr>
		{/each}
	</table>
</div>

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

	h3 {
		text-align: center;
	}

	div {
		padding-left: 20px;
	}
</style>
