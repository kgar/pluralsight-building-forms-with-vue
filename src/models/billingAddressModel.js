import { ref } from "vue";
import AddressModel from "./addressModel";
import useVuelidate from "@vuelidate/core";

export default class BillingAddressModel extends AddressModel {
  sameAsShipping = ref(false);

  get rules() {
    return {
      sameAsShipping: {},
      ...super.rules,
    };
  }
}
