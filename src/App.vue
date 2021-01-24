<template>
  <Error :message="errorMessage" />
  <payment-view></payment-view>
</template>

<script>
import PaymentView from "@/views/PaymentView.vue";
import Error from "@/components/Error.vue";
import state from "@/state";

export default {
  components: {
    PaymentView,
    Error,
  },
  setup() {
    return {
      errorMessage: state.errorMessage,
    };
  },
};
</script>
