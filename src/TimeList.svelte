<script lang="ts">
	import "./css/main.css";
	import { timeStore } from "./TimeStore";

	let resetButton: HTMLButtonElement;

	function resetTimes() {
		timeStore.resetTimes();
		resetButton.blur();
	}
</script>

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
		{#each $timeStore as { time, ao5, ao12 }, i (i)}
			<tr>
				<td>{i + 1}</td>
				<td>{time}</td>
				<td>{ao5}</td>
				<td>{ao12}</td>
				<td>
					<button on:click={() => timeStore.deleteTimeEntry(i)}> X </button>
				</td>
			</tr>
		{/each}
	</table>
</div>

<style>
	div {
		padding-left: 20px;
	}
</style>
