<template>
  <div>
    <h3>Payment</h3>
    <form novalidate @submit.prevent="onSave">
      <div class="row">
        <div class="col-md-6">
          <div><strong>Shipping Information</strong></div>
          <Address-View :address="model.shipping">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Your Name"
                v-model="model.shipping.fullName.$model"
              />
              <ValidationMessage :model="model.shipping.fullName" />
            </div>
            <div class="form-group">
              <label for="company">Company Name</label>
              <input
                type="text"
                id="company"
                class="form-control"
                placeholder="Company Name"
                v-model="model.shipping.company.$model"
              />
              <ValidationMessage :model="model.shipping.company" />
            </div>
          </Address-View>
          <div class="form-group">
            <input
              type="submit"
              value="Next"
              class="btn btn-success"
              :disabled="model.$invalid"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div><strong>Billing Information</strong></div>
          <Address-View
            :address="model.billing"
            :isDisabled="payment.billing.sameAsShipping"
          >
            <div class="form-check">
              <input
                type="checkbox"
                id="sameAsShipping"
                class="form-check-input"
                v-model="model.billing.sameAsShipping.$model"
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
              v-model="model.creditCard.number.$model"
              id="ccNumber"
            />
            <ValidationMessage :model="model.creditCard.number" />
          </div>
          <div class="form-group">
            <label for="nameOnCard">Name on Card</label>
            <input
              type="text"
              id="nameOnCard"
              class="form-control"
              v-model="model.creditCard.nameOnCard.$model"
            />
            <ValidationMessage :model="model.creditCard.nameOnCard" />
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="expirationMonth">Expiration Month</label>
              <select
                id="expirationMonth"
                v-model="model.creditCard.expirationMonth.$model"
                class="form-control"
              >
                <option v-for="m in months" :key="m.number">
                  {{ m.number }} - {{ m.name }}
                </option>
              </select>
              <ValidationMessage :model="model.creditCard.expirationMonth" />
            </div>
            <div class="form-group col-md-4">
              <label for="expirationYear">Expiration Year</label>
              <select
                id="expirationYear"
                v-model="model.creditCard.expirationYear.$model"
                class="form-control"
              >
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
              <ValidationMessage :model="model.creditCard.expirationYear" />
            </div>
            <div class="form-group col-md-4">
              <label for="cvv">CVV Code</label>
              <input
                type="text"
                id="cvv"
                v-model="model.creditCard.cvv.$model"
                class="form-control"
              />
              <ValidationMessage :model="model.creditCard.cvv" />
            </div>
          </div>
          <!--
          <div class="text-danger" v-if="model.creditCard.$invalid">
            <ul>
              <li v-for="e in model.creditCard.$errors" :key="e.errorMessage">
                {{ e.$property }}: {{ e.$message }}
              </li>
            </ul>
          </div>
        --></div>
      </div>
    </form>
    <div>
      <pre>{{ payment }}</pre>
    </div>
    <div>
      <pre>{{ model }} </pre>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, reactive } from "vue";
import months from "@/lookup/months.js";
import AddressView from "@/views/AddressView.vue";
import state from "@/state";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import ValidationMessage from "@/components/ValidationMessage.vue";
import { creditcard } from "@/validators";

export default {
  components: {
    AddressView,
    ValidationMessage,
  },
  emits: ["onError"],
  setup(props, { emit }) {
    const payment = reactive(state);

    const error = ref("");

    async function onSave() {
      const isValid = await model.value.$validate();
      if (!isValid) {
        return;
      }
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

    const model = state.toModel();

    return {
      payment,
      model,
      onSave,
      zipcode,
      months,
      years,
    };
  },
};
</script>