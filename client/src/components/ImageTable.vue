<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; // optional
import Row from 'primevue/row';
</script>

<template>
  <DataTable :value="products" removableSort resizableColumns columnResizeMode="fit" tableStyle="min-width: 50rem">
    <Column sortable field="code" header="Code"></Column>
    <Column sortable field="name" header="Name"></Column>
    <Column sortable field="category" header="Category"></Column>
    <Column sortable field="quantity" header="Quantity"></Column>
  </DataTable>
</template>

<style scoped></style>
