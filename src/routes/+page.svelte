<script lang="ts">
	import CodeMirror from "svelte-codemirror-editor";
	import { markdown } from "@codemirror/lang-markdown";
  import NDK, { NDKEvent, NDKKind, type NostrEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
	import Toggle from "svelte-toggle";

	import { getNDK } from "../relays";
  import { buildMarkdownFromEvents } from "../utilities/build-markdown";
	import Modal from '../lib/components/Modal.svelte';
	
	export let modalMessage: 'ExtensionRequired' | 'NotePublished' | undefined;
	$: showModal = modalMessage !== undefined;
	let loading: string | null = null;
	let publishToDev: boolean = true;

	let appendToTextToggled = true;

	let codeMirrorContent = 'Click Run Query to fetch events and render them as markdown lists';
	
	let url: string | null = null;
	let limit = 10;

	let ndk: NDK;

	async function loadEvents() {
		loading = "Loading...";

		ndk = getNDK('Remote');
		await ndk.connect(6000);

		const filterObject: NDKFilter = {
      limit,
      kinds: [1]
    };

		if (url) {
			filterObject['#r'] = [url];
		}

    const events = await ndk.fetchEvents(filterObject);

		const markdownText = buildMarkdownFromEvents([...events].map((e) => e.rawEvent()));
		codeMirrorContent = appendToTextToggled 
			? codeMirrorContent + "\n\n" + markdownText 
			: markdownText;

		loading = null;
	}

	async function nwcAsk() {
		if (!window.nostr) {
			modalMessage = 'ExtensionRequired';
		} else {
			const pubkey = await window.nostr.getPublicKey();

			const nostrEvent: NostrEvent = {
				content: codeMirrorContent,
				created_at: Date.now(),
				pubkey,
				kind: NDKKind.Article,
				tags: []
			};
			
			const { sig } = await window.nostr.signEvent(nostrEvent);

			nostrEvent.sig = sig;

			if (publishToDev) {
				ndk.devWriteRelaySet
			}
			
			const event = new NDKEvent(ndk, nostrEvent);
			await event.publish();

			modalMessage = 'NotePublished';
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="main">
	{#if !!showModal}
		<Modal bind:showModal>
			{#if modalMessage === 'ExtensionRequired'}
			This application requires <a href="https://github.com/nostr-protocol/nips/blob/master/07.md">NIP-07</a> browser extension to sign nostr events.
			{:else if modalMessage === 'NotePublished'}
			Your note has published 🚀
			{/if}
		</Modal>
	{/if}

	<div>
		<label for="url">URL:</label>
		<input type="text" id="url" bind:value={url} placeholder="Enter URL if you want to load highlights of a page" width="200px">
	</div>

	<div>
		<label for="limit">Limit (1-20):</label>
		<input type="number" id="limit" bind:value={limit} min="1" max="20">
	</div>

	<div style="display: inline-block">
		<Toggle bind:appendToTextToggled small label="Append to text" />
		<div>{appendToTextToggled}</div>
	</div>


	<button on:click={loadEvents}>
		{#if loading}
			Running the query...
		{:else}
			Run Query
		{/if}
	</button>

	<CodeMirror bind:value={codeMirrorContent} lang={markdown()} styles={{
		"&": {
				width: "500px",
				maxWidth: "100%"
		}
}} lineWrapping={true} />

	<h3>Options</h3>

	

	<button on:click={nwcAsk}>Post as Long form content (kind: {NDKKind.Article})</button>
</section>

<style>
	section.main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		row-gap: 10px;
	}
</style>
