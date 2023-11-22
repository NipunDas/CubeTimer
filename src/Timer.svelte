<script lang="ts">
	import "./css/main.css";
	import { Scrambow } from "scrambow";

	let time = "0";
	let startDate: Date;
	let interval: number;
	let timing = false;
	let keyDown = false;
	let timeArray: string[] = [];
	let timeColor = "black";
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
	}
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
<h3>
	{scramble}
</h3>
<select bind:value={scrambleType}>
	<option value="333">3x3</option>
	<option value="222">2x2</option>
	<option value="sq1">sq1</option>
</select>
<h1 style="color: {timeColor}">
	{time}
</h1>
<div>
	<button on:click={resetTimes}> Reset Times </button>
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
