<script lang="ts">
	import "./css/main.css";
	import { Scrambow } from "scrambow";
	import Page from "./routes/+page.svelte";

	let time = "0";
	let startDate: Date;
	let interval: number;
	let timing = false;
	let keyDown = false;
	let timeArray: string[] = [];
	let timeColor = "black";
	let resetButton: HTMLButtonElement;
	let eventSelector: HTMLSelectElement;
	let scrambleType = "333";
	$: scramble = new Scrambow().setType(scrambleType).get()[0].scramble_string;

	function handleKeyDown(event: KeyboardEvent) {
		if (!keyDown) {
			if (timing) {
				time = ((new Date().getTime() - startDate.getTime()) / 1000).toFixed(2);
				clearInterval(interval);
				timeArray = [...timeArray, time];
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
		</tr>
		{#each timeArray as eachTime, i (i)}
			<tr>
				<td>{i + 1}</td>
				<td>{eachTime}</td>
				<td>{eachTime}</td>
				<td>{eachTime}</td>
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
