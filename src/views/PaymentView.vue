<template>
  <div>
    <h3>Payment</h3>
    <form novalidate @submit.prevent="onSave">
      <div class="row">
        <div class="col-md-6">
          <div><strong>Shipping Information</strong></div>
          <Address-View :address="payment.shipping">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Your Name"
                v-model="payment.shipping.fullName"
              />
            </div>
            <div class="form-group">
              <label for="company">Company Name</label>
              <input
                type="text"
                id="company"
                class="form-control"
                placeholder="Company Name"
                v-model="payment.shipping.company"
              />
            </div>
          </Address-View>
          <div class="form-group">
            <input type="submit" value="Next" class="btn btn-success" />
          </div>
        </div>
        <div class="col-md-6">
          <div><strong>Billing Information</strong></div>
          <Address-View
            :address="payment.billing"
            :isDisabled="payment.billing.sameAsShipping"
          >
            <div class="form-check">
              <input
                type="checkbox"
                id="sameAsShipping"
                class="form-check-input"
                v-model="payment.billing.sameAsShipping"
              />
              <label for="sameAsShipping" class="form-check-label"
                >Same As Shipping?</label
              >
            </div>
          </Address-View>
          <div><strong>Credit Card</strong></div>
          <div class="form-group">
            <label for="ccNumber">Credit Card Number</label>
            <input
              type="text"
              class="form-control"
              v-model="payment.creditCard.number"
              id="ccNumber"
            />
          </div>
          <div class="form-group">
            <label for="nameOnCard">Name on Card</label>
            <input
              type="text"
              id="nameOnCard"
              class="form-control"
              v-model="payment.creditCard.nameOnCard"
            />
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="expirationMonth">Expiration Month</label>
              <select
                id="expirationMonth"
                v-model="payment.creditCard.expirationMonth"
                class="form-control"
              >
                <option v-for="m in months" :key="m.number">
                  {{ m.number }} - {{ m.name }}
                </option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label for="expirationYear">Expiration Year</label>
              <select
                id="expirationYear"
                v-model="payment.creditCard.expirationYear"
                class="form-control"
              >
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label for="cvv">CVV Code</label>
              <input
                type="text"
                id="cvv"
                v-model="payment.creditCard.cvv"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
    <div>
      <pre>{{ payment }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, reactive } from "vue";
import months from "@/lookup/months.js";
import AddressView from "@/views/AddressView.vue";
import state from "@/state";

export default {
  components: {
    AddressView,
  },
  emits: ["onError"],
  setup(props, { emit }) {
    const payment = reactive(state);

    const error = ref("");

    function onSave() {
      state.errorMessage.value = "We can't save yet, we don't have an API";
    }

    const zipcode = computed({
      get: () => payment.postalCode,
      set: (val) => {
        if (val && typeof val === "string") {
          if (val.length <= 5 || val.indexOf("-") > -1) {
            payment.postalCode = val;
          } else {
            payment.postalCode = `${val.substring(0, 5)}-${val.substring(5)}`;
          }
        }
      },
    });

    watch(
      // What to watch
      () => payment.billing.sameAsShipping,
      // What to do
      () => {
        if (payment.billing.sameAsShipping) {
          payment.billing.clear();
        }
      }
    );

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => i + currentYear);

    return {
      payment,
      onSave,
      zipcode,
      months,
      years,
    };
  },
};
</script>