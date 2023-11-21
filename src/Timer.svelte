<script lang="ts">
	let time = "0";
	let tempDate: Date;
	let startDate: Date;
	let interval: number;
	let timing = false;
	let timeArray: string[] = [];

	function handleKeyDown(event: KeyboardEvent) {
		console.log("key down!");
		if (event.key === " " && !event.repeat) {
			if (timing) {
				tempDate = new Date();
				clearInterval(interval);
				time = ((tempDate.getTime() - startDate.getTime()) / 1000).toFixed(2);
				timeArray = [...timeArray, time];
			} else {
				time = "0";
			}
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		console.log("key up!");
		if (event.key === " " && !timing) {
			startDate = new Date();
			interval = setInterval(() => {
				tempDate = new Date();
				time = Math.trunc((tempDate.getTime() - startDate.getTime()) / 1000).toString();
			}, 10);
		}
		timing = !timing;
	}

	function resetTimes() {
		timeArray = [];
	}
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
<h1>
	{time}
</h1>
<div>
	<button on:click={resetTimes}> Reset Times </button>
	<ol>
		{#each timeArray as eachTime, i (i)}
			<li>{eachTime}</li>
		{/each}
	</ol>
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

	button {
		display: inline-block;
		border: 1px solid #0366ee;
		border-radius: 4px;
		background: #0366ee;
		color: #ffffff;
		font-weight: 600;
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			Helvetica Neue,
			Helvetica,
			Arial,
			sans-serif;
		font-size: 1rem;
		text-transform: none;
		padding: 0.75rem 1.25rem;
		margin: 0 0 0.5rem 0;
		vertical-align: middle;
		text-align: center;
		cursor: pointer;
		text-decoration: none;
		line-height: 1;
	}

	li {
		font-family: Helvetica;
	}

	div {
		padding-left: 20px;
	}
</style>
