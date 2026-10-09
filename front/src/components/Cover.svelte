<script lang="ts">
    const { coverImg } = $props();
</script>

<div class="h-220 overflow-hidden">
<div class="relative flex justify-center opacity-60">
    {#if coverImg && coverImg.path}
            <img src={coverImg.path} 
                 alt="Website Cover"
                 class="h-300 object-cover mt-[-50px] w-[90%]" />
    {/if}
</div>

<div class="absolute top-[400px] 
            left-[-200px] md:left-[-250px] 
            lg:left-[-150px] xl:left-[-100px]
            2xl:left-[400px]">
    <div class="flex flex-col gap-2">
        <span class="text-7xl font-extrabold text-nowrap">Nora's Keez</span>
        <span class="text-4xl font-bold">{coverImg.description}</span>
    </div>
</div>
</div>

