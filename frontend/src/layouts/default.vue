<template>
  <v-app>
    <v-main>
      <Notivue v-slot="item">
        <Notification :item="item" :theme="materialTheme" />
      </Notivue>

      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { Notivue, Notification, materialTheme } from "notivue";
</script>
