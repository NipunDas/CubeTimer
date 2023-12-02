<script lang="ts">
	import { randomScrambleForEvent } from "cubing/scramble";
	import type { Alg } from "cubing/alg";
	import { timing } from "./TimeStore";

	let eventSelector: HTMLSelectElement;
	let scramblePromise: Promise<Alg>;
	let scrambleType = "333";

	/* Reactive declaration: if $timing store or scrambleType change (and $timing
       is false), generate a new scramble */
	$: {
		if (!$timing) {
			scramblePromise = randomScrambleForEvent(scrambleType);
		}
	}
</script>

{#await scramblePromise}
	<h3>Generating scramble...</h3>
{:then alg}
	<h3>{alg.toString()}</h3>
{/await}

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
	<option value="333oh">3x3 OH</option>
	<option value="333bf">3x3 BLD</option>
	<option value="333fm">3x3 FMC</option>
	<option value="minx">Megaminx</option>
	<option value="pyram">Pyraminx</option>
	<option value="skewb">Skewb</option>
	<option value="sq1">Square-1</option>
	<option value="clock">Clock</option>
	<option value="444bf">4x4 BLD</option>
	<option value="555bf">5x5 BLD</option>
	<option value="333mbf">3x3 MBLD</option>
</select>

<style>
	h3 {
		text-align: center;
	}
</style>
