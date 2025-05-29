<script lang="ts">
    interface CoverProps {
        cover: { image: string };
    }

    const { cover }: CoverProps = $props();
</script>

<div class="h-220 overflow-hidden">

<div class="relative flex justify-center bg-black opacity-20">
    {#if cover.image}
            <img src={cover.image} 
                 alt="Capa do site"
                 class="h-300 object-cover mt-[-50px]" />
    {/if}
</div>

<div class="absolute top-[400px] 
            left-[-200px] md:left-[-250px] 
            lg:left-[-150px] xl:left-[-100px]
            2xl:left-[50px] rotate-270">
    <h2 class="text-[120px] text-nowrap">Thiago Brisolla</h2>
    <p class="subheading">Uma frase de efeito aqui</p>
</div>
</div>

