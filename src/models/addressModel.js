import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { required, minLength } from "@vuelidate/validators";

export default class AddressModel {
  address1 = ref("");
  address2 = ref("");
  cityTown = ref("");
  stateProvince = ref("");
  postalCode = ref("");

  clear() {
    this.address1 = "";
    this.address2 = "";
    this.cityTown = "";
    this.stateProvince = "";
    this.postalCode = "";
  }

  get rules() {
    return {
      address1: { required, minLength: minLength(5) },
      address2: {},
      cityTown: { required, minLength: minLength(2) },
      stateProvince: { required },
      postalCode: { required, minLength: minLength(5) },
    };
  }

  toModel() {
    return useVuelidate(this.rules, this);
  }
}
