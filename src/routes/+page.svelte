<script>
	import CodeMirror from "svelte-codemirror-editor";
	import { markdown } from "@codemirror/lang-markdown";

	let value = `* nostr:note1whxfpqukvkv3l20td8c0a5kxrv8are7j3kptzkk4def0ta9g0a2q73k0cm
  So true!&#x20;

* One of the key differences between Nostr and other social media platforms is its decentralised architecture.

* Nostr places a high emphasis on security and privacy for its users. All data on the platform is encrypted end-to-end and stored on decentralised servers. This means that only the user has control over their data and it is not stored in a central location that can be hacked or monitored.

* Nostr is designed to be a community-driven platform. It encourages users to connect with others and build relationships, rather than simply posting content for likes and followers.
`;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<CodeMirror bind:value lang={markdown()} styles={{
		"&": {
				width: "500px",
				maxWidth: "100%"
		}
}} lineWrapping={true} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
