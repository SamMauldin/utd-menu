<script>
	import { DateTime } from "luxon";
	import MenuSection from "./MenuSection.svelte";
	import { fetch } from "./menu";

	let friendlyDate = "...";
	let currentDate;

	let menuSections = [];
	let loaded = false;

	function setDate(dt) {
		currentDate = dt;

		friendlyDate = dt.toLocaleString({
			month: "long",
			day: "numeric",
			weekday: "long"
		});

		loaded = false;

		fetch(dt, function(err, data) {
			if (err) {
				loaded = "error";
				return;
			}

			loaded = true;
			menuSections = data;
		});
	}

	setDate(DateTime.local().setZone("America/Chicago"));

	function back() {
		if (!loaded) { return; }
		setDate(currentDate.minus({
			days: 1
		}));
	}

	function forward() {
		if (!loaded) { return; }
		setDate(currentDate.plus({
			days: 1
		}));
	}
	

</script>

<style>
	h1, p {
		margin: 0em;
		text-align: center;
	}

	.menu {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.menu > .section {
		width: 100%;
	}

	@media screen and (min-width:600px) {
		.menu > .section {
			flex: 1;
			max-width: 20em;
		}
	}

	.legal {
		padding-top: 3em;
		padding-bottom: 3em;
		color: gray;
		font-size: 12px;
	}

	.date {
		font-size: 25px;
		font-weight: bold;
		text-align: center;
	}

	button {
		border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;

    background: transparent;

    /* inherit font & color from ancestor */
    color: inherit;
    font: inherit;

    /* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */
    line-height: normal;

    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    /* Corrects inability to style clickable `input` types in iOS */
    -webkit-appearance: none;

		text-align: center;
	}

	a {
		text-decoration: underline;
		color: inherit;
	}
</style>

<h1>UTD DHW Dining Menu</h1>

<div class="date">
<button on:click={back}>&lt;&lt;</button>
{friendlyDate}
<button on:click={forward}>&gt;&gt;</button>
</div>

<hr>


{#if loaded == true}
	{#if menuSections.length == 0}
		<p>Nothing on the menu for today!</p>
		<p>(Or the request for data failed)</p>
	{/if}	
	<div class="menu">
		{#each menuSections as section}
			<div class="section">
				<MenuSection {section}/>
			</div>
		{/each}
	</div>
{:else if loaded == "error"}
	<p>An error occured!</p>
{:else}
	<p>Loading...</p>
{/if}

<p class="legal">
	A utility by Sam Mauldin. <a href="mailto:sam@mauldin.me">Contact</a>. Copyright 2019. All rights reserved. Data from UTD Dining Services.
	I am not affiliated, associated, authorized, endorsed by, or in any way officially connected with the University of Texas at Dallas, or any of its subsidiaries or its affiliates.
</p>