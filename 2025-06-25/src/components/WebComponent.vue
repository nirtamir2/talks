<script setup>

import r2wc from "@r2wc/react-to-web-component";
import { ReactComponent } from "./ReactComponent";


customElements.define("react-counter", r2wc(ReactComponent, {
    props: {
        name: "string",
    },
}))

</script>

<template>
    <div class="text-white">
        <div>Hi there!</div>
        <react-counter name="nir"></react-counter>
    </div>
</template>
