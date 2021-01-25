import useVuelidate from "@vuelidate/core";
import { reactive, ref } from "vue";
import BillingAddressModel from "../models/billingAddressModel";
import CreditCardModel from "../models/creditCardModel";
import ShippingAddressModel from "../models/shippingAddressModel";

export default {
  billing: reactive(new BillingAddressModel()),
  shipping: reactive(new ShippingAddressModel()),
  creditCard: reactive(new CreditCardModel()),
  errorMessage: ref(""),

  toModel() {
    const rules = {
      billing: this.billing.rules,
      shipping: this.shipping.rules,
      creditCard: this.creditCard.rules,
    };

    return useVuelidate(rules, this);
  },
};
