<script setup>
import { formatRupiah } from "@/composables/formatRupiah"

defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  totals: {
    type: Object,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="table-scroll">
    <table class="expense-table">
      <thead>
        <tr>
          <th class="sticky-column number-column">
            No
          </th>
          <th class="sticky-column date-column">
            Tanggal
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
          >
            {{ column.label }}
          </th>
          <th class="total-column">
            Jumlah
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.tanggal"
        >
          <td class="sticky-column number-column text-center">
            {{ row.no }}
          </td>
          <td class="sticky-column date-column text-center">
            {{ formatDate(row.tanggal) }}
          </td>
          <td
            v-for="column in columns"
            :key="column.key"
            class="text-right"
            :class="{ 'has-value': row[column.key] > 0 }"
          >
            {{ row[column.key] > 0 ? formatRupiah(row[column.key]) : "-" }}
          </td>
          <td class="total-column text-right">
            {{ row.jumlah > 0 ? formatRupiah(row.jumlah) : "-" }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td
            colspan="2"
            class="sticky-column total-label text-center"
          >
            TOTAL
          </td>
          <td
            v-for="column in columns"
            :key="column.key"
            class="text-right"
          >
            {{ formatRupiah(totals[column.key] || 0) }}
          </td>
          <td class="text-right">
            {{ formatRupiah(totals.jumlah || 0) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.table-scroll {
  overflow-x: auto;
}

.expense-table {
  width: 100%;
  min-width: 1120px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.8rem;
}

.expense-table th {
  position: sticky;
  z-index: 4;
  top: 0;
  padding: 12px 10px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-size: 0.72rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
}

.expense-table td {
  min-width: 140px;
  padding: 9px 10px;
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.expense-table tbody tr:nth-child(even) td {
  background: rgba(var(--v-theme-on-surface), 0.025);
}

.expense-table tbody tr:hover td {
  background: rgba(var(--v-theme-primary), 0.08);
}

.expense-table .sticky-column {
  position: sticky;
  z-index: 3;
  background: rgb(var(--v-theme-surface));
}

.expense-table .number-column {
  left: 0;
  min-width: 56px;
  width: 56px;
}

.expense-table .date-column {
  left: 56px;
  min-width: 112px;
  width: 112px;
}

.expense-table thead .sticky-column {
  z-index: 6;
  background: rgb(var(--v-theme-primary));
}

.expense-table .has-value {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.expense-table .total-column {
  background: rgba(var(--v-theme-error), 0.08);
  font-weight: 700;
}

.expense-table tfoot td {
  padding: 13px 10px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-weight: 700;
}

.expense-table .total-label {
  left: 0;
  z-index: 5;
  background: rgb(var(--v-theme-primary));
}
</style>
