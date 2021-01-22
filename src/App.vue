<template>
  <div>
    <h3>Payment</h3>
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <form novalidate @submit.prevent="onSave">
      <div class="row">
        <div class="col-md-6">
          <div><strong>Shipping Information</strong></div>
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
          <div class="form-group">
            <label for="address1">Address</label>
            <input
              type="text"
              id="address1"
              class="form-control"
              placeholder="Street Address"
              v-model="payment.shipping.address1"
            />
          </div>
          <div class="form-group">
            <label for="address2">Suite/Apartment #</label>
            <input
              type="text"
              id="address2"
              class="form-control"
              placeholder=""
              v-model="payment.shipping.address2"
            />
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="cityTown">City</label>
              <input
                type="text"
                id="cityTown"
                class="form-control"
                placeholder="e.g. New York"
                v-model="payment.shipping.cityTown"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="stateProvince">State</label>
              <select
                id="stateProvince"
                class="form-control"
                v-model="payment.shipping.state"
              >
                <option
                  v-for="s in states"
                  :key="s.abbreviation"
                  :value="s.abbreviation"
                >
                  {{ stateFormat(s) }}
                </option>
              </select>
            </div>
            <div class="form-group col-md-3">
              <label for="postalCode">Zip Code</label>
              <input
                type="text"
                id="postalCode"
                class="form-control"
                placeholder="e.g. 10101"
                v-model="payment.shipping.postalCode"
              />
            </div>
            <div class="form-group">
              <input type="submit" value="Next" class="btn btn-success" />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div><strong>Billing Information</strong></div>
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

          <div class="form-group">
            <label for="address1">Address</label>
            <input
              type="text"
              id="address1"
              class="form-control"
              placeholder="Street Address"
              v-model="payment.billing.address1"
              :disabled="payment.billing.sameAsShipping"
            />
          </div>
          <div class="form-group">
            <label for="address2">Suite/Apartment #</label>
            <input
              type="text"
              id="address2"
              class="form-control"
              placeholder=""
              v-model="payment.billing.address2"
              :disabled="payment.billing.sameAsShipping"
            />
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="cityTown">City</label>
              <input
                type="text"
                id="cityTown"
                class="form-control"
                placeholder="e.g. New York"
                v-model="payment.billing.cityTown"
                :disabled="payment.billing.sameAsShipping"
              />
            </div>
            <div class="form-group col-md-3">
              <label for="stateProvince">State</label>
              <select
                id="stateProvince"
                class="form-control"
                v-model="payment.billing.state"
                :disabled="payment.billing.sameAsShipping"
              >
                <option
                  v-for="s in states"
                  :key="s.abbreviation"
                  :value="s.abbreviation"
                >
                  {{ stateFormat(s) }}
                </option>
              </select>
            </div>
            <div class="form-group col-md-3">
              <label for="postalCode">Zip Code</label>
              <input
                type="text"
                id="postalCode"
                class="form-control"
                placeholder="e.g. 10101"
                v-model="payment.billing.postalCode"
                :disabled="payment.billing.sameAsShipping"
              />
            </div>
          </div>
          <div><strong>Credit Card</strong></div>
          <div class="form-group">
            <label for="ccNumber">Credit Card Number</label>
            <input
              type="text"
              class="form-control"
              v-model="payment.creditcard.number"
              id="ccNumber"
            />
          </div>
          <div class="form-group">
            <label for="nameOnCard">Name on Card</label>
            <input
              type="text"
              id="nameOnCard"
              class="form-control"
              v-model="payment.creditcard.nameOnCard"
            />
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="expirationMonth">Expiration Month</label>
              <select
                id="expirationMonth"
                v-model="payment.creditcard.expirationMonth"
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
                v-model="payment.creditcard.expirationYear"
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
                v-model="payment.creditcard.cvv"
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
import { ref, computed, watch } from "vue";
import states from "@/lookup/states.js";
import months from "@/lookup/months.js";
import formatters from "@/formatters";

export default {
  setup() {
    const payment = ref({
      shipping: {},
      billing: {
        sameAsShipping: false,
      },
      creditcard: {},
    });

    const error = ref("");

    function onSave() {
      error.value = "We can't save yet, we don't have an API";
    }

    const zipcode = computed({
      get: () => payment.value.postalCode,
      set: (val) => {
        if (val && typeof val === "string") {
          if (val.length <= 5 || val.indexOf("-") > -1) {
            payment.value.postalCode = val;
          } else {
            payment.value.postalCode = `${val.substring(0, 5)}-${val.substring(
              5
            )}`;
          }
        }
      },
    });

    watch(
      // What to watch
      () => payment.value.billing.sameAsShipping,
      // What to do
      () => {
        if (payment.value.billing.sameAsShipping) {
          payment.value.billing.address1 = "";
          payment.value.billing.address2 = "";
          payment.value.billing.cityTown = "";
          payment.value.billing.stateProvince = "";
          payment.value.billing.postalCode = "";
        }
      }
    );

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => i + currentYear);

    return {
      payment,
      states,
      onSave,
      ...formatters,
      zipcode,
      error,
      months,
      years,
    };
  },
};
</script>