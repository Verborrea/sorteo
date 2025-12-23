<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';

	let datos: any = $state();
	let cargando = $state(true);
	let musicaIniciada = $state(false); // Para mostrar/ocultar el botón de inicio
  let audioPlayer: HTMLAudioElement | undefined = $state();

  const snowflakes = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100, // posición horizontal (0-100%)
    duration: Math.random() * 5 + 5, // velocidad (5-10s)
    delay: Math.random() * 5, // retraso inicial
    size: Math.random() * 20 + 5, // tamaño (5-15px)
    opacity: Math.random() * 0.5 + 0.3, // transparencia
		blur: Math.random() * 2 // desenfoque
  }));

	function comenzar() {
    musicaIniciada = true;
		if (audioPlayer) {
			audioPlayer.play();
		}
  }

	onMount(async () => {
		const token = localStorage.getItem('mi_regalo_token');

		const res = await fetch('/api/asignar', {
			method: 'POST',
			body: JSON.stringify({ token }),
			headers: { 'Content-Type': 'application/json' }
		});

		const resultado = await res.json();
		
		if (res.ok) {
			datos = resultado;
			if (resultado.nuevoToken) {
				localStorage.setItem('mi_regalo_token', resultado.nuevoToken);
			}
		}
		cargando = false;
	});
</script>

<audio bind:this={audioPlayer} src="/navidad.mp3" loop></audio>
<main class="overflow-hidden relative flex flex-col items-center justify-center text-center min-h-dvh">
	<img src="/daza.avif" alt="Daza" class="inset-0 absolute w-full h-full object-cover z-0 brightness-75"/>
	{#if musicaIniciada}
	<img transition:scale={{ opacity: 0, duration: 2000, delay:0 }} src="/santi.avif" alt="Santiago" class="inset-0 absolute w-full h-full object-cover z-0"/>
	<div class="pointer-events-none absolute inset-0" aria-hidden="true">
    {#each snowflakes as flake}
      <div 
        class="snowflake" 
        style:left="{flake.left}%" 
        style:animation-duration="{flake.duration}s" 
        style:animation-delay="{flake.delay}s"
        style:font-size="{flake.size}px"
        style:opacity="{flake.opacity}"
				style:filter="blur({flake.blur}px);"
      >
        ❄
      </div>
    {/each}
  </div>
	{/if}
	{#if cargando}
		<h1>Cargando... 🎄</h1>
	{:else if !musicaIniciada}
		<div class="z-20">
			<button 
				onclick={comenzar}
				class="bg-red-500 hover:bg-red-600 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-xl transform transition-all active:scale-85"
			>
				Abrir Sorteo
			</button>
		</div>
	{:else if datos}
		<div class="animate-reveal bg-white text-slate-600 p-6 rounded-2xl shadow-2xl text-xl flex flex-col items-center justify-center gap-5 leading-none relative z-10">
			<p>Tu eres el número:</p>
			<div class="text-9xl font-black text-lime-600">{datos.de_numero}</div>
			<div class="h-px w-full bg-slate-600"></div>
			<p>Te toca regalarle al:</p>
			<div class="text-9xl font-black text-red-500">{datos.para_numero}</div>
		</div>
	{:else}
		<p>Hubo un error o el sorteo terminó.</p>
	{/if}
</main>

<style>
	main {
		background-size: cover;
		background-position: center;
	}

	.snowflake {
    position: absolute;
    top: -20px;
    color: white;
    user-select: none;
    z-index: 1;
    animation: fall linear infinite both;
  } 
</style>