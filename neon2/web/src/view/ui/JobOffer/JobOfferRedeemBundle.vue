<template>
  <Design.Card title="Wykorzystaj swój pakiet">
    {{props.planBundle}}
  </Design.Card>
  <Design.Tile>
    <Design.Row>
      <Design.RowEnd>
        <Design.Button primary @click="redeemBundle">
          Skorzystaj z pakietu by Opublikować
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
  </Design.Tile>
</template>

<script setup lang="ts">
import {Design} from "../design/design";
import {PlanBundle} from "../ui";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOfferId: number;
  planBundle: PlanBundle|null;
}

interface Emit {
  (event: 'redeem-bundle', jobOfferId: number): void;
}

function redeemBundle(): void {
  emit('redeem-bundle', props.jobOfferId);
}
</script>
