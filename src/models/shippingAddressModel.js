import { ref } from "vue";
import AddressModel from "./addressModel";
import { required } from "@vuelidate/validators";

export default class ShippingAddressModel extends AddressModel {
  fullName = ref("");
  company = ref("");

  get rules() {
    return {
      fullName: { required },
      company: {},
      ...super.rules,
    };
  }
}
