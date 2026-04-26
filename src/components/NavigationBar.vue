<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import {
        Menubar,
        MenubarContent,
        MenubarItem,
        MenubarMenu,
        MenubarSeparator,
        // MenubarShortcut,
        MenubarTrigger,
    } from '@/components/ui/menubar'
    import { Button } from '@/components/ui/button'
    import { Sun, Moon } from 'lucide-vue-next'

    const theme = ref("light")

    watch(theme, (t) => {
        console.log("trigger");
        localStorage.setItem("theme", t)
        if (t === "light") {
            document.body.classList.remove("dark")
        } else if (t === "dark") {
            document.body.classList.add("dark")
        }
    })  

    function toggle() {
        if (theme.value === "dark") {
            theme.value = "light"
        } else if (theme.value === "light") {
            theme.value = "dark"
        } 
    }

    onMounted(() => {
        theme.value = localStorage.getItem("theme") ?? "light"
    })
    
</script>

<template>
    <div class="p-2">
        <Menubar class="flex flex-row items-center justify-between">
            <div>
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>Open Video</MenubarItem>
                        <MenubarItem>Open Audio</MenubarItem>
                        <MenubarItem>Open Subtitble</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Save</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </div>
            <div >
                <Button variant="ghost" size="icon-sm" @click="toggle">
                    <Sun v-if="theme === 'light'" />
                    <Moon v-if="theme === 'dark'" />
                </Button>
            </div>
      </Menubar>
    </div>
</template>